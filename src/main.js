// src/main.js
import { CONFIG } from './config.js';
import { Player, Bullet, Enemy, Star, Particle } from './entities.js';
import { InputHandler } from './input.js';
import { checkAABB } from './renderer.js';
import { leaderboard } from './leaderboard.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler();
        
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.player = new Player(this.canvas.width, this.canvas.height);
        this.bullets = [];
        this.enemies = [];
        this.stars = [];
        this.particles = [];
        
        this.score = 0;
        this.level = 1;
        this.gameState = 'START';
        this.spawnTimer = 0;
        this.lastFireTime = 0;
        this.screenShake = 0;
        this.levelUpTimer = 0;

        this.initStars();
        this.initUI();
        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.player) {
            this.player.y = this.canvas.height - this.player.height - 80;
        }
    }

    initStars() {
        for (let i = 0; i < 150; i++) {
            const layer = Math.floor(Math.random() * 3) + 1;
            this.stars.push(new Star(this.canvas.width, this.canvas.height, layer));
        }
    }

    initUI() {
        const startBtn = document.getElementById('start-btn');
        const overlay = document.getElementById('overlay');
        
        startBtn.addEventListener('click', () => {
            if (this.gameState === 'GAMEOVER') {
                this.handleScoreSubmission();
            } else {
                this.startGame();
            }
            startBtn.blur(); // Fix: Prevent Spacebar from re-triggering the button
        });

        this.updateLivesUI();
    }

    startGame() {
        const overlay = document.getElementById('overlay');
        this.reset();
        this.gameState = 'PLAYING';
        overlay.classList.remove('visible');
    }

    async handleScoreSubmission() {
        const playerName = prompt("ENTER YOUR CALLSIGN:", "RECRUIT") || "RECRUIT";
        await leaderboard.submitScore(playerName, this.score);
        this.showLeaderboard();
    }

    async showLeaderboard() {
        const scores = await leaderboard.getTopScores();
        const desc = document.getElementById('overlay-desc');
        const title = document.getElementById('overlay-title');
        const startBtn = document.getElementById('start-btn');

        title.innerText = "COMMANDER STANDINGS";
        let html = '<div class="leaderboard-list">';
        scores.forEach((s, i) => {
            html += `<div class="entry"><span>${i+1}. ${s.name}</span><span>${s.score}</span></div>`;
        });
        html += '</div>';
        desc.innerHTML = html;
        startBtn.innerText = "RETURN TO MISSION";
        
        // Change button behavior to restart
        startBtn.onclick = () => {
            startBtn.onclick = null; // Reset
            this.startGame();
        };
    }

    reset() {
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.level = 1;
        this.updateScoreUI();
        this.updateLevelUI();
        this.updateLivesUI();
        this.levelUpTimer = 0;
    }

    update() {
        if (this.gameState !== 'PLAYING') return;

        // Background
        this.stars.forEach(s => s.update(this.canvas.height));

        // Player
        this.player.update(this.input.keys, this.input.joystick.x, this.input.joystick.y, this.canvas.width, this.canvas.height);

        // Firing
        const now = Date.now();
        if (this.input.isFiring() && now - this.lastFireTime > 200 && this.bullets.length < CONFIG.MAX_BULLETS) {
            const bx = this.player.x + this.player.width / 2;
            const by = this.player.y;
            this.bullets.push(new Bullet(bx, by));
            this.lastFireTime = now;
        }

        // Bullets
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => b.active && !b.toRemove);

        // Enemies
        this.spawnTimer++;
        const spawnRate = Math.max(20, CONFIG.ENEMY_SPAWN_RATE - (this.level - 1) * 10);
        if (this.spawnTimer > spawnRate) {
            const speed = CONFIG.ENEMY_START_SPEED + (this.level - 1) * 0.8;
            this.enemies.push(new Enemy(this.canvas.width, speed));
            this.spawnTimer = 0;
        }

        this.enemies.forEach(e => e.update());
        
        // Cleanup off-screen enemies
        this.enemies = this.enemies.filter(e => e.active && !e.toRemove);

        // Particles
        this.particles.forEach((p, i) => {
            p.update();
            if (p.life <= 0) this.particles.splice(i, 1);
        });

        this.checkCollisions();

        if (this.screenShake > 0) this.screenShake *= 0.9;
    }

    checkCollisions() {
        for (const bullet of this.bullets) {
            for (const enemy of this.enemies) {
                if (bullet.toRemove || enemy.toRemove) continue;
                
                if (checkAABB(bullet.getRect(), enemy.getRect())) {
                    this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, CONFIG.COLORS.ENEMY);
                    enemy.toRemove = true;
                    bullet.toRemove = true;
                    this.score++;
                    this.updateScoreUI();
                    this.checkLevelUp();
                }
            }
        }

        for (const enemy of this.enemies) {
            if (enemy.toRemove) continue;
            
            if (checkAABB(enemy.getRect(), this.player.getRect())) {
                enemy.toRemove = true;
                this.takeDamage();
            }
        }
    }

    takeDamage() {
        if (this.player.invincible) return;

        this.player.lives--;
        this.player.invincible = true;
        this.player.lastHit = Date.now();
        this.screenShake = 20;
        this.updateLivesUI();

        if (this.player.lives <= 0) {
            this.gameOver();
        }

        setTimeout(() => {
            this.player.invincible = false;
        }, CONFIG.INVINCIBILITY_TIME);
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    gameOver() {
        this.gameState = 'GAMEOVER';
        const overlay = document.getElementById('overlay');
        const title = document.getElementById('overlay-title');
        const desc = document.getElementById('overlay-desc');
        const startBtn = document.getElementById('start-btn');
        
        title.innerText = "MISSION FAILED";
        desc.innerText = `Final Score: ${this.score}. Defenses breached. Leaderboard upload available.`;
        startBtn.innerText = "SUBMIT CALLSIGN & SCORE";
        overlay.classList.add('visible');
    }

    updateScoreUI() {
        document.getElementById('score-val').innerText = this.score.toString().padStart(4, '0');
    }

    checkLevelUp() {
        if (this.score > 0 && this.score % CONFIG.LEVEL_UP_THRESHOLD === 0) {
            this.level++;
            this.levelUpTimer = 120;
            this.updateLevelUI();
            this.screenShake = 10;
        }
    }

    updateLevelUI() {
        document.getElementById('level-val').innerText = this.level.toString().padStart(2, '0');
    }

    updateLivesUI() {
        const container = document.getElementById('lives-icons');
        container.innerHTML = '';
        for (let i = 0; i < this.player.lives; i++) {
            const icon = document.createElement('div');
            icon.className = 'life-icon';
            container.appendChild(icon);
        }
    }

    draw() {
        this.ctx.fillStyle = CONFIG.COLORS.BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        if (this.screenShake > 1) {
            this.ctx.translate((Math.random() - 0.5) * this.screenShake, (Math.random() - 0.5) * this.screenShake);
        }

        this.stars.forEach(s => s.draw(this.ctx));
        this.particles.forEach(p => p.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.player.draw(this.ctx);
        
        if (this.levelUpTimer > 0) {
            this.drawLevelUp();
            this.levelUpTimer--;
        }

        this.ctx.restore();
    }

    drawLevelUp() {
        this.ctx.save();
        this.ctx.font = 'bold 48px Segoe UI';
        this.ctx.fillStyle = CONFIG.COLORS.PLAYER;
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = CONFIG.COLORS.PLAYER;
        
        const alpha = Math.min(1, this.levelUpTimer / 30);
        this.ctx.globalAlpha = alpha;
        
        this.ctx.fillText(`LEVEL ${this.level}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '16px Segoe UI';
        this.ctx.fillText('ENEMIES REINFORCED', this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.ctx.restore();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

new Game();


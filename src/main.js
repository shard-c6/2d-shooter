// src/main.js
import { CONFIG } from './config.js';
import { Player, Bullet, Enemy, Star, Particle } from './entities.js';
import { InputHandler } from './input.js';
import { checkAABB } from './renderer.js';

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
        this.gameState = 'START';
        this.spawnTimer = 0;
        this.lastFireTime = 0;
        this.screenShake = 0;

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
            this.reset();
            this.gameState = 'PLAYING';
            overlay.classList.remove('visible');
        });

        this.updateLivesUI();
    }

    reset() {
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.updateScoreUI();
        this.updateLivesUI();
    }

    update() {
        if (this.gameState !== 'PLAYING') return;

        // Background
        this.stars.forEach(s => s.update(this.canvas.height));

        // Player
        this.player.update(this.input.keys, this.input.joystick.x);

        // Firing
        const now = Date.now();
        if (this.input.isFiring() && now - this.lastFireTime > 200 && this.bullets.length < CONFIG.MAX_BULLETS) {
            const bx = this.player.x + this.player.width / 2;
            const by = this.player.y;
            this.bullets.push(new Bullet(bx, by));
            this.lastFireTime = now;
        }

        // Bullets
        this.bullets.forEach((b, i) => {
            b.update();
            if (!b.active) this.bullets.splice(i, 1);
        });

        // Enemies
        this.spawnTimer++;
        const spawnRate = Math.max(15, CONFIG.ENEMY_SPAWN_RATE - Math.floor(this.score / 10) * 5);
        if (this.spawnTimer > spawnRate) {
            const speed = CONFIG.ENEMY_START_SPEED + (this.score / 20);
            this.enemies.push(new Enemy(this.canvas.width, speed));
            this.spawnTimer = 0;
        }

        this.enemies.forEach((e, i) => {
            e.update();
            if (!e.active) {
                this.enemies.splice(i, 1);
                this.takeDamage();
            }
        });

        // Particles
        this.particles.forEach((p, i) => {
            p.update();
            if (p.life <= 0) this.particles.splice(i, 1);
        });

        this.checkCollisions();

        // Screen Shake decay
        if (this.screenShake > 0) this.screenShake *= 0.9;
    }

    checkCollisions() {
        // Bullet vs Enemy
        this.bullets.forEach((b, bi) => {
            this.enemies.forEach((e, ei) => {
                if (checkAABB(b.getRect(), e.getRect())) {
                    this.createExplosion(e.x + e.width / 2, e.y + e.height / 2, CONFIG.COLORS.ENEMY);
                    this.enemies.splice(ei, 1);
                    this.bullets.splice(bi, 1);
                    this.score++;
                    this.updateScoreUI();
                }
            });
        });

        // Enemy vs Player
        this.enemies.forEach((e, ei) => {
            if (checkAABB(e.getRect(), this.player.getRect())) {
                this.enemies.splice(ei, 1);
                this.takeDamage();
            }
        });
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
        
        title.innerText = "SYSTEM FAILURE";
        desc.innerText = `Final Score: ${this.score}. The sector has fallen under hostile control.`;
        startBtn.innerText = "REBOOT CORE";
        overlay.classList.add('visible');
    }

    updateScoreUI() {
        document.getElementById('score-val').innerText = this.score.toString().padStart(4, '0');
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
        
        this.ctx.restore();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

new Game();

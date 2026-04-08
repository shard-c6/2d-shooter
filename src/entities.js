// src/entities.js
import { CONFIG } from './config.js';
import { drawBresenhamLine, transformPoint } from './renderer.js';

export class Player {
    constructor(canvasWidth, canvasHeight) {
        this.width = CONFIG.PLAYER_SIZE;
        this.height = CONFIG.PLAYER_SIZE;
        this.x = canvasWidth / 2 - this.width / 2;
        this.y = canvasHeight - this.height - 40;
        this.lives = CONFIG.PLAYER_LIVES;
        this.rotation = 0; // In radians
        this.targetRotation = 0;
        this.invincible = false;
        this.lastHit = 0;
    }

    update(keys, joystickX, joystickY, canvasWidth, canvasHeight) {
        let dx = 0;
        let dy = 0;
        this.targetRotation = 0;

        // Horizontal Movement
        if (keys['ArrowLeft'] || keys['a'] || joystickX < -0.2) {
            dx = -CONFIG.PLAYER_SPEED;
            this.targetRotation = -0.3; // Bank left
        } else if (keys['ArrowRight'] || keys['d'] || joystickX > 0.2) {
            dx = CONFIG.PLAYER_SPEED;
            this.targetRotation = 0.3; // Bank right
        }

        // Vertical Movement (New Feature)
        if (keys['ArrowUp'] || keys['w'] || joystickY < -0.2) {
            dy = -CONFIG.PLAYER_SPEED;
        } else if (keys['ArrowDown'] || keys['s'] || joystickY > 0.2) {
            dy = CONFIG.PLAYER_SPEED;
        }

        this.x += dx;
        this.y += dy;

        // Interpolate rotation for smoothness (Inertia effect)
        this.rotation += (this.targetRotation - this.rotation) * 0.1;

        // Viewport Clipping (Production Standard: Clamped boundaries)
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
        
        // Vertical constraint: Allow player to move only in the bottom third of the screen
        const minPlayerY = canvasHeight * 0.6;
        const maxPlayerY = canvasHeight - this.height - 20;
        this.y = Math.max(minPlayerY, Math.min(this.y, maxPlayerY));
    }

    draw(ctx) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) return;

        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = CONFIG.COLORS.PLAYER;
        ctx.fillStyle = CONFIG.COLORS.PLAYER;

        // Define primary vertices relative to center
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        
        const v1 = transformPoint(cx, this.y, cx, cy, 1, this.rotation); // Top
        const v2 = transformPoint(this.x, this.y + this.height, cx, cy, 1, this.rotation); // Bottom Left
        const v3 = transformPoint(this.x + this.width, this.y + this.height, cx, cy, 1, this.rotation); // Bottom Right

        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    getRect() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

export class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = CONFIG.BULLET_SPEED;
        this.active = true;
        this.toRemove = false;
    }

    update() {
        this.y -= this.speed;
        if (this.y < -20) this.active = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = CONFIG.COLORS.BULLET;
        // Manual Bresenham for bullets
        drawBresenhamLine(ctx, this.x, this.y, this.x, this.y + 10, CONFIG.COLORS.BULLET);
        ctx.restore();
    }

    getRect() {
        return { x: this.x - 2, y: this.y, width: 4, height: 10 };
    }
}

export class Enemy {
    constructor(canvasWidth, speed) {
        this.width = CONFIG.ENEMY_SIZE;
        this.height = CONFIG.ENEMY_SIZE;
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height;
        this.speed = speed;
        this.active = true;
        this.toRemove = false;
        this.type = Math.random() > 0.5 ? 'hex' : 'rect';
    }

    update() {
        this.y += this.speed;
        if (this.y > window.innerHeight) this.active = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = CONFIG.COLORS.ENEMY;
        ctx.strokeStyle = CONFIG.COLORS.ENEMY;
        ctx.lineWidth = 2;

        if (this.type === 'hex') {
            // Draw a hexagon polygon
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                let angle = (i * Math.PI) / 3;
                let nx = this.x + this.width/2 + (this.width/2) * Math.cos(angle);
                let ny = this.y + this.height/2 + (this.height/2) * Math.sin(angle);
                if (i === 0) ctx.moveTo(nx, ny);
                else ctx.lineTo(nx, ny);
            }
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }

    getRect() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

export class Star {
    constructor(w, h, layer) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.layer = layer; // 1, 2, or 3 for parallax
        this.speed = layer * 0.5;
        this.size = layer * 0.8;
    }

    update(h) {
        this.y += this.speed;
        if (this.y > h) this.y = 0;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * this.layer})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        // Scaling effect: they get smaller
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        let s = 3 * this.life;
        ctx.fillRect(this.x, this.y, s, s);
        ctx.globalAlpha = 1.0;
    }
}

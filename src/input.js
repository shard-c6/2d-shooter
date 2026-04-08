// src/input.js

export class InputHandler {
    constructor() {
        this.keys = {};
        this.joystick = { x: 0, y: 0, active: false };
        this.firePressed = false;

        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        this.initMobileControls();
    }

    initMobileControls() {
        const joystickZone = document.getElementById('joystick-zone');
        const joystickBase = document.getElementById('joystick-base');
        const joystickStick = document.getElementById('joystick-stick');
        const fireBtn = document.getElementById('fire-btn');

        if (!joystickZone) return;

        const handleTouch = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = joystickBase.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = rect.width / 2;

            if (distance > maxDistance) {
                dx *= maxDistance / distance;
                dy *= maxDistance / distance;
            }

            this.joystick.x = dx / maxDistance;
            this.joystick.y = dy / maxDistance;
            this.joystick.active = true;

            joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
        };

        const resetTouch = () => {
            this.joystick.x = 0;
            this.joystick.y = 0;
            this.joystick.active = false;
            joystickStick.style.transform = `translate(0px, 0px)`;
        };

        joystickZone.addEventListener('touchstart', handleTouch);
        joystickZone.addEventListener('touchmove', handleTouch);
        joystickZone.addEventListener('touchend', resetTouch);

        fireBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.firePressed = true;
        });
        fireBtn.addEventListener('touchend', () => {
            this.firePressed = false;
        });
    }

    isFiring() {
        const firing = this.keys[' '] || this.firePressed;
        if (this.firePressed) {
            // We'll reset it in the main loop if we want semi-auto
        }
        return firing;
    }
}

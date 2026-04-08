// src/config.js

export const CONFIG = {
    FPS: 60,
    PLAYER_SPEED: 9,
    PLAYER_SIZE: 30,
    PLAYER_LIVES: 3,
    INVINCIBILITY_TIME: 1500, // ms
    
    BULLET_SPEED: 12,
    MAX_BULLETS: 8,
    
    ENEMY_START_SPEED: 2.5,
    ENEMY_SIZE: 35,
    ENEMY_SPAWN_RATE: 90, // frames (1.5s interval at Level 1)
    LEVEL_UP_THRESHOLD: 15,
    
    COLORS: {
        BG: '#050508',
        PLAYER: '#00f2ff',
        ENEMY: '#ff0055',
        BULLET: '#00f2ff',
        STAR: '#ffffff',
        PARTICLE: '#bc13fe'
    },
    
    // CG mapping constants for viva
    CG_METHODS: {
        LINE: 'Bresenham Algorithm',
        COLLISION: 'AABB (Axis-Aligned Bounding Box)',
        TRANSFORM: '2D Matrix Translation & Rotation'
    }
};

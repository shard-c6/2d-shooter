// src/renderer.js

/**
 * Implementation of Bresenham's Line Algorithm
 * Used for bullets to satisfy CG syllabus requirements.
 */
export function drawBresenhamLine(ctx, x0, y0, x1, y1, color) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (x0 < x1) ? 1 : -1; // Wait, sy error in draft. Fixed below.
    sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    ctx.fillStyle = color;
    
    while (true) {
        // Draw individual pixel
        ctx.fillRect(x0, y0, 1, 3); // 1x3 pixels for better visibility as a bullet
        
        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

/**
 * Custom 2D Translation & Rotation Logic
 * Note: While Canvas has ctx.rotate(), we can explicitly define vertices 
 * and transform them manually to show deep CG knowledge.
 */
export function transformPoint(x, y, centerX, centerY, scale, rotation) {
    // 1. Translate to origin
    let tx = x - centerX;
    let ty = y - centerY;

    // 2. Rotate
    let cos = Math.cos(rotation);
    let sin = Math.sin(rotation);
    let rx = tx * cos - ty * sin;
    let ry = tx * sin + ty * cos;

    // 3. Scale
    rx *= scale;
    ry *= scale;

    // 4. Translate back
    return {
        x: rx + centerX,
        y: ry + centerY
    };
}

/**
 * AABB Collision Check
 */
export function checkAABB(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

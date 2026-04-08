# Stellar Guardian | CG Space Shooter (Web Edition)

A premium, web-native 2D space shooter designed for the Computer Graphics course. This version is optimized for performance, aesthetics (lucrative design), and cross-platform accessibility (Desktop & Mobile).

## Key Features
- **Lucrative Design**: Neon-glow aesthetics, Glassmorphism HUD, and smooth 60FPS animations.
- **Academic CG Mapping**:
    - **Bresenham's Algorithm**: Bullets are rendered using a manual JS implementation of Bresenham's line drawing.
    - **2D Transformations**: Ship "banking" uses rotation matrices. Starfield uses multi-layer translation for parallax.
    - **Collision Detection**: Implements Axis-Aligned Bounding Box (AABB) checks.
- **Cross-Platform**: Full keyboard support for Desktop and on-screen Touch controls (Joystick + Fire) for Mobile.

## How to Run
1. **Locally**: Simply open `index.html` in any modern web browser (Chrome, Safari, Edge, Firefox).
2. **Web Deployment**: Since there is no build step (Vanilla JS), you can drop these files into GitHub Pages, Vercel, or Netlify and it will work instantly.

## Controls
- **Desktop**:
    - `A / D` or `Left / Right Arrorw`: Move
    - `SPACE`: Fire
- **Mobile**:
    - `Joystick` (Left): Move
    - `Red Button` (Right): Fire

## Project Structure
- `index.html`: UI structure.
- `style.css`: Premium styling.
- `src/`: Core logic.
    - `renderer.js`: Manual CG Algorithms.
    - `entities.js`: Object-oriented game entities.
    - `input.js`: Unified input handling.
- `python_version/`: Contains the original Python/Pygame implementation for reference.

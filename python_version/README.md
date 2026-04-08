# 2D Space Shooter - Computer Graphics Mini Project

A 2D space shooter built with Python and Pygame inside a 1-day sprint, designed to demonstrate several core Computer Graphics (CG) pipeline concepts.

## Setup Instructions

1. **Prerequisites**: Python 3.8+ 
2. **Install Pygame**: `pip install pygame` (or `pip3 install pygame` depending on your environment)
3. **Run the Game**: `python main.py` or `python3 main.py`

## CG Concept Mapping (Viva Preparation)

| **Game Feature** | **CG Concept** | **Syllabus Module** | **Notes / Viva Answer** |
| :--- | :--- | :--- | :--- |
| **Bullet rendering** | Bresenham Line Drawing Algorithm | Module 2 | Uses efficient integer-only arithmetic to draw straight vertical lines in real-time, preventing floating-point rounding errors. |
| **Player shape** | Polygon Rendering (Triangle) | Module 2 | Vertex-based polygon definition and Pygame’s underlying scan-line fill for the solid triangle shape. |
| **Enemy shapes** | Polygon Rendering (Rectangle, Circle) | Module 2 | Renders circles mapping to the Midpoint Circle Algorithm implementation inside the backend renderer. |
| **Player and Enemy movement** | 2D Translation Transformation | Module 3 | T(dx, 0) and T(0, speed) are applied each frame via coordinate transformation instead of manual matrix multiplication for performance optimization. |
| **Screen boundary check** | Viewport Clipping | Module 3 | Cohen-Sutherland-style bounding to prevent the player coordinates from exceeding the viewport edges. |
| **Bullet off-screen removal** | Line Clipping | Module 3 | Bullets outside the window limits are culled and deactivated, releasing memory. |
| **Game loop structure** | Rasterization Pipeline | Module 1 | Mirrors the core `Process -> Clear Buffer -> Render -> Flip Framebuffer` cycle as standard graphics engines do. |
| **Collision Detection** | AABB (Axis-Aligned Bounding Box) | Custom | Quickly filters and checks overlaps using bounding coordinates (X, Y ranges). |

## Controls

- `Left/Right Arrow` or `A/D` - Move Horizontal
- `SPACEBAR` - Fire Bullets (Max 5 on screen)
- `R` - Restart Game (When dead)
- `Q` - Quit Game (When dead)

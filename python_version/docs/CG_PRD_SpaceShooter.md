PRD — 2D Space Shooter | Computer Graphics Project

**PRODUCT REQUIREMENTS DOCUMENT**

2D Space Shooter — Computer Graphics Mini Project

Built with Python + Pygame  |  CG Syllabus Aligned  |  1-Day Sprint

# **1. Project Overview**
This document defines all requirements, technical specifications, CG concept mapping, and implementation milestones for the 2D Space Shooter mini project, built as part of the Computer Graphics course. It is intended for use by the development team and as a reference during the viva examination.

|**Field**|**Value**|
| :- | :- |
|Project Name|2D Space Shooter|
|Course|Computer Graphics (CG)|
|Technology Stack|Python 3.x + Pygame|
|Build Timeline|1 day (12 hours)|
|Team Size|2–4 members|
|Deliverable|Executable game + source code + viva demo|
|Target Platform|macOS / Windows / Linux|

# **2. Objectives**
The project achieves two goals simultaneously: delivering a functional interactive game and demonstrating mastery of Computer Graphics pipeline concepts as covered in the CG syllabus.

## **2.1 Academic Objectives**
- Implement core raster drawing algorithms (Bresenham Line Drawing)
- Apply 2D geometric transformations: Translation, Rotation, Scaling
- Demonstrate viewport clipping and screen boundary enforcement
- Use polygon rendering for all game entities (player, enemies, bullets)
- Apply collision detection using bounding box (AABB) technique

## **2.2 Game Objectives**
- Build a playable top-down shooter with real-time player input
- Implement wave-based enemy spawning with increasing difficulty
- Add a score counter, lives system, and game over state
- Deliver smooth 60 FPS rendering using Pygame's game loop

# **3. CG Concept Mapping (Syllabus Alignment)**
Every game feature is intentionally mapped to a Computer Graphics concept from the course syllabus. The table below is your primary reference for viva questions.

|**Game Feature**|**CG Concept**|**Syllabus Module**|**Viva Talking Point**|
| :- | :- | :- | :- |
|Bullet rendering|Bresenham Line Drawing Algorithm|Module 2|Efficient integer-only raster line drawing; avoids floating-point arithmetic|
|Player shape|Polygon Rendering (Triangle)|Module 2|Vertex-based polygon definition and scan-line fill for solid shapes|
|Enemy shapes|Polygon Rendering (Rectangle, Circle)|Module 2|Circle rasterization using Midpoint Circle Algorithm|
|Player movement|2D Translation Transformation|Module 3|Homogeneous coordinate translation matrix T(dx, dy)|
|Enemy descent|2D Translation Transformation|Module 3|Uniform translation applied each frame — T(0, speed)|
|Player banking (optional)|2D Rotation Transformation|Module 3|Rotation matrix R(theta) around player centroid|
|Screen boundary check|Viewport Clipping|Module 3|Cohen-Sutherland / trivial accept-reject for objects at screen edges|
|Bullet off-screen removal|Line Clipping|Module 3|Clip lines to window boundary — bullets outside viewport are culled|
|Sprite scale-up on spawn|Scaling Transformation|Module 3|Uniform scaling S(sx, sy) with origin at object center|
|Game loop timing|Rasterization Pipeline|Module 1|Per-frame clear, draw, flip — mirrors the CG rendering pipeline|

# **4. Functional Requirements**
## **4.1 Player**
- Render as a filled triangle pointing upward, using polygon rendering
- Move left/right with arrow keys or A/D; vertical position is fixed
- Clamp position to screen boundaries using viewport clipping
- Start with 3 lives; lose 1 on enemy collision
- Short invincibility period (1.5 seconds) after taking damage

## **4.2 Bullets**
- Fire upward on SPACEBAR press
- Render using Bresenham Line Drawing Algorithm — this is the key CG demo
- Move at constant velocity each frame using translation
- Destroyed when they exit the top of the screen (clipping)
- Max 5 bullets on screen simultaneously to prevent spam

## **4.3 Enemies**
- Rendered as filled rectangles or circles using polygon/circle rasterization
- Spawn at random x positions at the top of the screen
- Descend toward the player using downward translation each frame
- Destroyed on bullet collision; player loses a life if they reach the bottom
- Spawn speed increases every 10 points scored

## **4.4 Collision Detection**
- Use Axis-Aligned Bounding Box (AABB) for all entity pairs
- Check bullet-enemy and enemy-player pairs each frame
- Collision resolution: destroy both bullet and enemy, increment score

## **4.5 HUD (Heads-Up Display)**
- Score counter in top-left corner
- Lives remaining in top-right corner
- Game Over screen on 0 lives with final score and restart prompt

# **5. Non-Functional Requirements**

|**Requirement**|**Target**|**Notes**|
| :- | :- | :- |
|Frame rate|60 FPS|Use pygame.time.Clock().tick(60)|
|Screen resolution|800 x 600 px|Fixed window, no fullscreen required|
|Python version|3\.8 or higher|No downgrade needed — Pygame works with modern Python|
|Dependencies|pygame only|pip install pygame — single dependency|
|Code structure|Modular functions|Separate functions for draw, update, collision|
|Run command|python main.py|Single entry point, no build step|

# **6. System Architecture**
The game follows a standard game loop architecture with three phases per frame: Process Input → Update State → Render. This maps directly to the CG rendering pipeline discussed in Module 1.

## **6.1 Module Breakdown**

|**Module / File**|**Responsibility**|**CG Concept Inside**|
| :- | :- | :- |
|main.py|Game loop, event handling, FPS clock|Rendering pipeline — clear, draw, flip|
|player.py|Player class: draw, move, clipping|Translation + Viewport Clipping|
|bullet.py|Bullet class: Bresenham draw, move, cull|Bresenham Line Algorithm + Clipping|
|enemy.py|Enemy class: spawn, descend, polygon draw|Polygon Rendering + Translation|
|collision.py|AABB collision detection for all pairs|Bounding Box Intersection|
|hud.py|Score, lives, game-over screen rendering|Text rendering + screen layout|

## **6.2 Game Loop Pseudocode**
while running:

`    `events = process\_input()          # arrow keys, spacebar

`    `player.update(events)             # translate player

`    `bullets.update()                  # translate + clip

`    `enemies.update()                  # translate down

`    `check\_collisions(bullets, enemies) # AABB

`    `screen.fill(BLACK)                # clear buffer

`    `draw\_all(player, bullets, enemies) # render frame

`    `pygame.display.flip()             # swap buffers

# **7. 12-Hour Implementation Plan**
Divide the build into 6 phases. Each phase is independently testable — if a phase is complete, the game is still runnable.

|**Phase**|**Hours**|**Task**|**Owner**|**Done When**|
| :- | :- | :- | :- | :- |
|1 — Setup|Hour 1–2|Pygame window, black background, game loop, FPS clock|Team lead|Empty window opens at 60 FPS|
|2 — Player|Hour 3–4|Triangle polygon drawn, arrow key movement, boundary clipping|Member 1|Triangle moves and stops at screen edge|
|3 — Bullets|Hour 5–6|Bresenham line bullet, fires on SPACE, culled at top edge|Member 2|Bullets fire and disappear correctly|
|4 — Enemies|Hour 7–8|Rectangle enemies spawn at top, descend via translation, random x|Member 3|Enemies move down and reset on reaching bottom|
|5 — Collision|Hour 9–10|AABB collision: bullet-enemy destroys both, enemy-player loses life|Member 1+2|Shooting an enemy removes it and increments score|
|6 — Polish|Hour 11–12|HUD (score + lives), game-over screen, difficulty scaling, sound (optional)|All|Full playable game with game over state|

# **8. Setup Instructions (Mac / Windows / Linux)**
No Python downgrade is needed. Pygame is fully compatible with Python 3.8 through 3.13.

## **8.1 Mac Setup**
1. Open Terminal
1. Check your Python version: python3 --version
1. Install Pygame: pip3 install pygame
1. Verify: python3 -c "import pygame; print(pygame.version.ver)"
1. Run your project: python3 main.py

## **8.2 Windows Setup**
1. Open Command Prompt or PowerShell
1. Install Pygame: pip install pygame
1. Verify: python -c "import pygame; print(pygame.version.ver)"
1. Run: python main.py

## **8.3 Common Issues**

|**Issue**|**Fix**|
| :- | :- |
|'pygame' not found|Run: pip3 install pygame  (use pip3 on Mac, not pip)|
|Display error on Mac|Set env var: export SDL\_VIDEODRIVER=cocoa before running|
|Low FPS|Ensure clock.tick(60) is called at the end of the game loop|
|Black screen only|Call pygame.display.flip() — not pygame.display.update()|

# **9. Viva Preparation — Expected Questions**
Use these exact talking points during your viva. Each answer ties the game feature directly to a CG module concept.

|**Likely Question**|**Model Answer**|
| :- | :- |
|Why did you use Bresenham for bullets?|Bresenham's line algorithm uses only integer arithmetic — no floating-point rounding errors — making it faster for real-time raster rendering of lines (bullets).|
|How did you implement player movement?|Player movement uses 2D Translation — we apply T(dx, 0) each frame based on keyboard input, shifting the player's coordinate using the transformation matrix.|
|What is clipping used for in your game?|Viewport clipping ensures objects outside the screen boundary are not rendered. Bullets are culled when their y-coordinate exits the top of the window — this is analogous to Cohen-Sutherland line clipping.|
|How does collision detection work?|We use Axis-Aligned Bounding Box (AABB) — we check if two rectangles overlap by comparing their x and y ranges. No rotation is assumed, which makes this O(n) per frame.|
|What CG pipeline concepts did you apply?|We implemented the full raster pipeline: vertex definition (polygons), scan conversion (Bresenham), transformation (translation), clipping (viewport), and framebuffer output (display.flip).|

# **10. Deliverables Checklist**
- main.py — entry point and game loop
- player.py — player class with polygon draw and translation
- bullet.py — Bresenham bullet with clipping
- enemy.py — enemy class with polygon rendering
- collision.py — AABB collision logic
- hud.py — score, lives, game-over screen
- README.md — setup instructions and CG concept mapping
- This PRD document — for viva reference

Submit as a ZIP file named: CG\_Project\_SpaceShooter\_[RollNumbers].zip

*Document prepared for Computer Graphics Mini Project — Good luck!*
Page  of 

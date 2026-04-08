import pygame
from config import *

class Bullet:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.speed = BULLET_SPEED
        # The bullet is a vertical line. Let's make it 10 pixels long.
        self.length = 10
        self.active = True

    def update(self):
        # 2D Translation: T(0, -speed)
        self.y -= self.speed
        self._clip_to_viewport()

    def _clip_to_viewport(self):
        # Line Clipping
        # Culls the bullet when it completely exits the top of the screen
        if self.y + self.length < 0:
            self.active = False
            
    def _draw_bresenham_line(self, surface, x0, y0, x1, y1):
        # Bresenham Line Drawing Algorithm (Integer-only arithmetic)
        dx = abs(x1 - x0)
        dy = abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx - dy

        while True:
            # Check bounds to avoid drawing outside the window
            if 0 <= x0 < WINDOW_WIDTH and 0 <= y0 < WINDOW_HEIGHT:
                surface.set_at((x0, y0), YELLOW)
                
            if x0 == x1 and y0 == y1:
                break
                
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x0 += sx
            if e2 < dx:
                err += dx
                y0 += sy

    def draw(self, surface):
        if self.active:
            # We draw a vertical line from (self.x, self.y) up to (self.x, self.y + self.length)
            self._draw_bresenham_line(surface, int(self.x), int(self.y), int(self.x), int(self.y + self.length))

    # Required for AABB
    def get_rect(self):
        # Even though it's a line, AABB needs a small rectangle around it for intersection logic
        return (self.x - 1, self.y, 3, self.length)

import pygame
import time
from config import *

class Player:
    def __init__(self):
        self.x = WINDOW_WIDTH // 2 - PLAYER_SIZE // 2
        # Vertical position is fixed at the bottom
        self.y = WINDOW_HEIGHT - PLAYER_SIZE - 20
        self.speed = PLAYER_SPEED
        self.lives = PLAYER_START_LIVES
        self.last_hit_time = 0
        self.width = PLAYER_SIZE
        self.height = PLAYER_SIZE

    def update(self, keys):
        # 2D Translation Transformation: T(dx, 0)
        dx = 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            dx = -self.speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            dx = self.speed
            
        self.x += dx
        self._clip_to_viewport()

    def _clip_to_viewport(self):
        # Viewport Clipping
        if self.x < 0:
            self.x = 0
        elif self.x + self.width > WINDOW_WIDTH:
            self.x = WINDOW_WIDTH - self.width

    def draw(self, surface):
        # Polygon Rendering (Triangle pointing upward)
        # Vertices: top middle, bottom left, bottom right
        
        # Blink effect for invincibility
        if self.is_invincible():
            # blinking frequency
            if int(time.time() * 10) % 2 == 0:
                return  # Skip draw to create blinking effect
        
        point1 = (self.x + self.width // 2, self.y)
        point2 = (self.x, self.y + self.height)
        point3 = (self.x + self.width, self.y + self.height)
        
        pygame.draw.polygon(surface, GREEN, [point1, point2, point3])

    def take_hit(self):
        if not self.is_invincible():
            self.lives -= 1
            self.last_hit_time = time.time()
            return True
        return False

    def is_invincible(self):
        return (time.time() - self.last_hit_time) < INVINCIBILITY_DURATION
    
    # Required for AABB collision
    def get_rect(self):
        # Return left, top, width, height
        return (self.x, self.y, self.width, self.height)

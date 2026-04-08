import pygame
import random
from config import *

class Enemy:
    def __init__(self, score):
        self.size = ENEMY_SIZE
        # Spawn randomly across the top edge
        self.x = random.randint(0, WINDOW_WIDTH - self.size)
        self.y = -self.size
        
        # Scaling speed based on score (increases every 10 points)
        speed_multiplier = max(0, score // SPEED_INCREMENT_SCORE)
        self.speed = ENEMY_START_SPEED + (speed_multiplier * 0.5)
        
        self.active = True
        # Polygon Rendering (Rectangle or Circle shape selection)
        self.shape = random.choice(['rectangle', 'circle'])

    def update(self):
        # 2D Translation Transformation: T(0, speed)
        self.y += self.speed

    def draw(self, surface):
        if not self.active:
            return
            
        if self.shape == 'rectangle':
            # Polygon Rendering (Rectangle)
            # Scan-line filled natively by Pygame
            rect = pygame.Rect(self.x, self.y, self.size, self.size)
            pygame.draw.rect(surface, RED, rect)
        else:
            # Circle rendering (uses Midpoint Circle Algorithm under the hood)
            center_x = int(self.x + self.size / 2)
            center_y = int(self.y + self.size / 2)
            radius = int(self.size / 2)
            pygame.draw.circle(surface, RED, (center_x, center_y), radius)

    # AABB calculation requires a bounding rectangle
    def get_rect(self):
        return (self.x, self.y, self.size, self.size)

import pygame
from config import *

class HUD:
    def __init__(self):
        # Use default system font
        self.font = pygame.font.SysFont(None, 32)
        self.large_font = pygame.font.SysFont(None, 64)

    def draw(self, surface, score, lives):
        # Render score
        score_surface = self.font.render(f"Score: {score}", True, WHITE)
        surface.blit(score_surface, (10, 10))
        
        # Render lives
        lives_surface = self.font.render(f"Lives: {lives}", True, WHITE)
        # Position at top right
        lives_rect = lives_surface.get_rect()
        lives_rect.topright = (WINDOW_WIDTH - 10, 10)
        surface.blit(lives_surface, lives_rect)

    def draw_game_over(self, surface, final_score):
        # Draw game over text
        game_over_surface = self.large_font.render("GAME OVER", True, RED)
        go_rect = game_over_surface.get_rect()
        go_rect.center = (WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 - 50)
        surface.blit(game_over_surface, go_rect)
        
        # Draw final score
        score_surface = self.font.render(f"Final Score: {final_score}", True, WHITE)
        score_rect = score_surface.get_rect()
        score_rect.center = (WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 10)
        surface.blit(score_surface, score_rect)
        
        # Draw restart prompt
        restart_surface = self.font.render("Press 'R' to Restart or 'Q' to Quit", True, YELLOW)
        restart_rect = restart_surface.get_rect()
        restart_rect.center = (WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 50)
        surface.blit(restart_surface, restart_rect)

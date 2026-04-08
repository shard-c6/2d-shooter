import pygame
import sys
from config import *
from player import Player
from bullet import Bullet
from enemy import Enemy
from collision import check_aabb_collision
from hud import HUD

def main():
    # Initialize Pygame
    pygame.init()
    
    # Rasterization Pipeline: Framebuffer setup
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    pygame.display.set_caption("2D Space Shooter - CG Project")
    
    clock = pygame.time.Clock()
    
    # Game objects
    player = Player()
    bullets = []
    enemies = []
    hud = HUD()
    
    score = 0
    frames_since_last_spawn = 0
    game_over = False

    running = True
    while running:
        # Phase 1: Process Input
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if game_over:
                    if event.key == pygame.K_r:
                        # Reset game
                        main()
                        return
                    elif event.key == pygame.K_q:
                        running = False
                else:
                    if event.key == pygame.K_SPACE:
                        if len(bullets) < MAX_BULLETS:
                            # Fire from top-center of player
                            bx = player.x + player.width // 2
                            by = player.y
                            bullets.append(Bullet(bx, by))
        
        if game_over:
            screen.fill(BLACK)
            hud.draw_game_over(screen, score)
            pygame.display.flip()
            clock.tick(FPS)
            continue
            
        keys = pygame.key.get_pressed()
        
        # Phase 2: Update State
        player.update(keys)
        
        for bullet in bullets[:]:
            bullet.update()
            if not bullet.active:
                bullets.remove(bullet)
                
        # Spawning logic
        frames_since_last_spawn += 1
        current_spawn_rate = max(10, ENEMY_SPAWN_RATE - (score // SPEED_INCREMENT_SCORE) * 2)
        if frames_since_last_spawn >= current_spawn_rate:
            enemies.append(Enemy(score))
            frames_since_last_spawn = 0
            
        for enemy in enemies[:]:
            enemy.update()
            if enemy.y > WINDOW_HEIGHT:
                enemies.remove(enemy)
                # Player loses life if enemy reaches the bottom
                if player.take_hit():
                    if player.lives <= 0:
                        game_over = True
            
        # Collision Detection: AABB
        # Bullet vs Enemy
        bullets_to_remove = set()
        enemies_to_remove = set()
        
        for bullet in bullets:
            for enemy in enemies:
                if enemy not in enemies_to_remove and bullet not in bullets_to_remove:
                    if check_aabb_collision(bullet.get_rect(), enemy.get_rect()):
                        bullets_to_remove.add(bullet)
                        enemies_to_remove.add(enemy)
                        score += 1
                        
        bullets = [b for b in bullets if b not in bullets_to_remove]
        enemies = [e for e in enemies if e not in enemies_to_remove]
        
        # Enemy vs Player
        for enemy in enemies:
            if check_aabb_collision(enemy.get_rect(), player.get_rect()):
                enemies.remove(enemy)
                if player.take_hit():
                    if player.lives <= 0:
                        game_over = True
                break # only take one hit per frame max

        # Phase 3: Render Frame
        # Clear buffer
        screen.fill(BLACK)
        
        # Draw game objects
        player.draw(screen)
        for bullet in bullets:
            bullet.draw(screen)
        for enemy in enemies:
            enemy.draw(screen)
            
        # Draw HUD interface
        hud.draw(screen, score, player.lives)
        
        # Swap buffers
        pygame.display.flip()
        
        # Timing (Wait until next frame slot)
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()

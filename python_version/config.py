# config.py

# Window Settings
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
FPS = 60

# Colors (RGB)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)       # Player color
RED = (255, 0, 0)         # Enemy color
YELLOW = (255, 255, 0)    # Bullet color

# Player settings
PLAYER_SPEED = 5
PLAYER_SIZE = 30
PLAYER_START_LIVES = 3
INVINCIBILITY_DURATION = 1.5  # seconds

# Bullet settings
BULLET_SPEED = 10
MAX_BULLETS = 5

# Enemy settings
ENEMY_START_SPEED = 3
ENEMY_SIZE = 30
ENEMY_SPAWN_RATE = 60  # Initial spawn rate (frames per spawn)
SPEED_INCREMENT_SCORE = 10  # Score needed to increase speed

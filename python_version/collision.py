def check_aabb_collision(rect1, rect2):
    """
    Axis-Aligned Bounding Box (AABB) Collision Detection.
    Assumes no rotation.
    rect1 and rect2 should be tuples: (x, y, width, height)
    Returns True if rectangles overlap, False otherwise.
    """
    x1, y1, w1, h1 = rect1
    x2, y2, w2, h2 = rect2
    
    # Check for bounding box overlap logic
    if (x1 < x2 + w2 and
        x1 + w1 > x2 and
        y1 < y2 + h2 and
        y1 + h1 > y2):
        return True
        
    return False

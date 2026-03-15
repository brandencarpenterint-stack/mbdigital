import cv2
import numpy as np
import os
import sys

def process_image(img_path, output_dir, prefix):
    print(f"Processing {img_path}")
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Failed to load image")
        return
        
    print("Original shape:", img.shape)
    
    # Check if image has alpha, if not, add one
    if len(img.shape) == 2 or img.shape[2] == 3:
        # Convert to BGRA
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        
    # Floodfill background
    h, w = img.shape[:2]
    mask = np.zeros((h+2, w+2), np.uint8)
    
    # Needs to be 3 channels for floodfill
    img_bgr = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR) if img.shape[2] == 4 else img.copy()
    tolerance = (25, 25, 25)
    fill_color = (255, 255, 255)
    
    cv2.floodFill(img_bgr, mask, (0,0), fill_color, tolerance, tolerance)
    cv2.floodFill(img_bgr, mask, (w-1,0), fill_color, tolerance, tolerance)
    cv2.floodFill(img_bgr, mask, (0,h-1), fill_color, tolerance, tolerance)
    cv2.floodFill(img_bgr, mask, (w-1,h-1), fill_color, tolerance, tolerance)

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 254, 255, cv2.THRESH_BINARY_INV)
    
    # Use morphological operations to detach noise and connect components
    kernel = np.ones((5,5), np.uint8)
    opened = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, np.ones((15,15), np.uint8))
    
    # connected components
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(closed, connectivity=8)
    print(f"Found {num_labels - 1} connected components")
    
    os.makedirs(output_dir, exist_ok=True)
    
    count = 0
    # sort by x
    valid_stats = [s for s in stats[1:] if s[cv2.CC_STAT_WIDTH] > 30 and s[cv2.CC_STAT_HEIGHT] > 30]
    valid_stats.sort(key=lambda s: s[cv2.CC_STAT_LEFT])
    
    for stat in valid_stats:
        x = stat[cv2.CC_STAT_LEFT]
        y = stat[cv2.CC_STAT_TOP]
        w = stat[cv2.CC_STAT_WIDTH]
        h = stat[cv2.CC_STAT_HEIGHT]
        # Add padding
        padding = 15
        x1 = max(0, x - padding)
        y1 = max(0, y - padding)
        x2 = min(img.shape[1], x + w + padding)
        y2 = min(img.shape[0], y + h + padding)
        
        stamp = img[y1:y2, x1:x2].copy()
        
        # Make white pixels transparent in the stamp
        # We find pixels where R>235, G>235, B>235 and set alpha to 0
        b, g, r, a = cv2.split(stamp)
        white_mask = (r > 235) & (g > 235) & (b > 235)
        # Apply slight blur to mask for smooth edges? 
        a[white_mask] = 0
        stamp = cv2.merge((b, g, r, a))
        
        out_path = os.path.join(output_dir, f"{prefix}_{count}.png")
        cv2.imwrite(out_path, stamp)
        count += 1
        print(f"Saved {out_path} ({w}x{h})")

if __name__ == '__main__':
    process_image(sys.argv[1], sys.argv[2], sys.argv[3])

import cv2
import numpy as np

def detect_color(image_path):

    image = cv2.imread(image_path)

    image = cv2.resize(image, (300, 300))

    pixels = image.reshape((-1, 3))

    avg_color = np.mean(pixels, axis=0)

    b, g, r = avg_color

    print("Average BGR:", avg_color)

    if r > 180 and g > 180 and b > 180:
        return "White"

    elif r < 80 and g < 80 and b < 80:
        return "Black"

    elif r > 150 and g < 120 and b < 120:
        return "Red"

    elif b > 150 and r < 120:
        return "Blue"

    elif g > 150:
        return "Green"

    elif abs(r-g) < 30 and abs(g-b) < 30:
        return "Silver"

    else:
        return "Unknown"


color = detect_color("car.jpg")

print("Vehicle Color:", color)
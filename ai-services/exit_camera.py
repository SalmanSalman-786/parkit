from anpr import extract_plate
from api_client import register_exit

IMAGE_PATH = "car.jpg"

plate = extract_plate(IMAGE_PATH)

print("Vehicle Number:", plate)

register_exit(plate)
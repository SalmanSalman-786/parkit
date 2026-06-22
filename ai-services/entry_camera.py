from anpr import extract_plate
from color_detection import detect_color
from vehicle_type_detection import detect_vehicle_type

from api_client import register_entry


IMAGE_PATH = "car.jpg"


plate = extract_plate(IMAGE_PATH)

color = detect_color(IMAGE_PATH)

vehicle_type = detect_vehicle_type(IMAGE_PATH)

print("Vehicle Number:", plate)
print("Vehicle Color:", color)
print("Vehicle Type:", vehicle_type)


register_entry(
    vehicle_number=plate,
    vehicle_color=color,
    manufacturer="Unknown",
    model=vehicle_type,
    facility_id=1
)
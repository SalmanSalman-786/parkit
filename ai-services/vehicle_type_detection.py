from ultralytics import YOLO

model = YOLO("yolov8n.pt")


def detect_vehicle_type(image_path):

    results = model(image_path)

    for result in results:

        boxes = result.boxes

        for box in boxes:

            class_id = int(box.cls[0])

            class_name = model.names[class_id]

            print("Detected:", class_name)

            return class_name

    return "Unknown"
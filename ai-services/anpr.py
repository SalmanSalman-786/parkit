import cv2
import easyocr
import re

reader = easyocr.Reader(['en'])

def clean_plate(text):

    text = text.upper()

    text = text.replace(" ", "")
    text = text.replace("-", "")

    replacements = {
        "O": "0",
        "I": "1",
        "L": "4",
    }

    cleaned = ""

    for char in text:
        cleaned += replacements.get(char, char)

    return cleaned


def extract_plate(image_path):

    image = cv2.imread(image_path)

    results = reader.readtext(image)

    for detection in results:

        text = detection[1]

        if len(text) < 6:
            continue

        plate = clean_plate(text)

        print("Raw OCR :", text)
        print("Cleaned :", plate)

        return plate

    return None


plate = extract_plate("car.jpg")

print("Vehicle Number:", plate)
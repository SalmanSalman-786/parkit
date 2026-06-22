import requests

BASE_URL = "http://localhost:5000"


def register_entry(vehicle_number,
                   vehicle_color,
                   manufacturer,
                   model,
                   facility_id):

    payload = {
        "vehicle_number": vehicle_number,
        "vehicle_color": vehicle_color,
        "manufacturer": manufacturer,
        "model": model,
        "facility_id": facility_id
    }

    response = requests.post(
        f"{BASE_URL}/vehicles/entry",
        json=payload
    )

    print(response.json())


def register_exit(vehicle_number):

    payload = {
        "vehicle_number": vehicle_number
    }

    response = requests.post(
        f"{BASE_URL}/vehicles/exit",
        json=payload
    )

    print(response.json())
import easyocr

reader = easyocr.Reader(['en'])

result = reader.readtext('car.jpg')

print(result)
import os
from PIL import Image
from PIL.ExifTags import TAGS
import json

folder = "SELFIE"  # cartella con i tuoi selfie
data_list = []

for filename in os.listdir(folder):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        filepath = os.path.join(folder, filename)
        try:
            img = Image.open(filepath)
            exif_data = img._getexif()
            if exif_data:
                exif = {TAGS.get(k, k): v for k, v in exif_data.items()}
                dt = exif.get("DateTimeOriginal", None)
                if dt:
                    date, time = dt.split(" ")
                    year, month, day = map(int, date.split(":"))
                    hour, minute, second = map(int, time.split(":"))
                    data_list.append({
                        "filename": filename,
                        "year": year,
                        "month": month,
                        "day": day,
                        "hour": hour,
                        "minute": minute,
                        "second": second
                    })
        except:
            print(f"Errore con {filename}")

with open("selfie_data.json", "w") as f:
    json.dump(data_list, f, indent=2)

print("Metadati estratti in selfie_data.json")

from dotenv import load_dotenv
load_dotenv()
import os
from google import genai

client = genai.Client()
print("Listing models with google-genai:")
try:
    for m in client.models.list():
        print(" -", m.name)
except Exception as e:
    print("Error:", e)

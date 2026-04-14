# src/voice_generator.py

import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ELEVENLABS_API_KEY")

# Replace with actual voice ID from ElevenLabs
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"

project_root = os.path.dirname(os.path.dirname(__file__))



def generate_voice(text: str, filename: str = "voice.mp3") -> str:
    """
    Convert text to speech using ElevenLabs API.

    Args:
        text (str): Input text
        filename (str): Output filename

    Returns:
        str: Path to saved audio file
    """

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers)

        if response.status_code != 200:
            print(f"[Voice Error]: {response.text}")
            return ""

        output_path = os.path.join(project_root, 'outputs', 'voice', filename)

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)

        return output_path

    except Exception as e:
        print(f"[Voice Generator Error]: {e}")
        return ""
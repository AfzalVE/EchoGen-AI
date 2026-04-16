# src/voice_generator.py

import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ELEVENLABS_API_KEY")

# 🎙️ Multiple voices (VERY IMPORTANT)
VOICE_MAP = {
    "narrator": "9BunADdPd2R85fwv6qt2",   # default voice
    "customer": "DgOeOSyyBVp7LpHxpjxf"    # you can change later
}

project_root = os.path.dirname(os.path.dirname(__file__))


def generate_voice_segment(text: str, speaker: str, filename: str) -> str:
    """
    Generate voice for a specific speaker
    """

    voice_id = VOICE_MAP.get(speaker, VOICE_MAP["narrator"])

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

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
            try:
                error_data = response.json()
                message = error_data.get("detail", {}).get("message", "Voice API error")
            except:
                message = response.text

            return {
                "error": "Voice API Error",
                "details": message
            }

        output_path = os.path.join(project_root, 'outputs', 'voice', filename)

        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, "wb") as f:
            f.write(response.content)

        return output_path

    except Exception as e:
        print(f"[Voice Generator Error]: {e}")
        return ""


# 🔁 Keep old function (backward compatibility)
def generate_voice(text: str, filename: str = "voice.mp3") -> str:
    return generate_voice_segment(text, "narrator", filename)
# src/api.py
from fastapi import FastAPI
from pydantic import BaseModel
import os
import uuid
from datetime import datetime
import json

from src.script_generator import generate_script
from src.voice_generator import generate_voice
from src.music_handler import get_music_file
from src.audio_merger import merge_audio

app = FastAPI()


# 📦 Request schema
class AdRequest(BaseModel):
    product: str


# 🆔 Generate unique file names
def generate_unique_name(prefix="audio"):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:6]
    return f"{prefix}_{timestamp}_{unique_id}.mp3"


# 🧾 Save history
def save_history(entry):
    history_file = "outputs/history.json"

    os.makedirs("outputs", exist_ok=True)

    if not os.path.exists(history_file):
        with open(history_file, "w") as f:
            json.dump([], f)

    with open(history_file, "r") as f:
        data = json.load(f)

    data.append(entry)

    with open(history_file, "w") as f:
        json.dump(data, f, indent=2)


@app.get("/")
def home():
    return {"message": "Audio AI API is running 🚀"}


@app.get("/history")
def get_history():
    history_file = "outputs/history.json"

    if not os.path.exists(history_file):
        return []

    with open(history_file, "r") as f:
        return json.load(f)


@app.post("/generate-ad")
def generate_ad(request: AdRequest):
    try:
        # 🎯 Step 1: Generate script
        script = generate_script(request.product)

        # 🆔 Generate unique filenames
        voice_file = generate_unique_name("voice")
        final_file = generate_unique_name("final")

        # 🎙️ Step 2: Generate voice
        voice_path = generate_voice(script, voice_file)

        # 🎵 Step 3: Get music
        music_path = get_music_file("jingle.mp3")

        if not voice_path or not music_path:
            return {"error": "Voice or music generation failed"}

        # 🎧 Step 4: Merge
        final_path = merge_audio(
            voice_path,
            music_path,
            final_file
        )

        # 🧾 Save history
        entry = {
            "product": request.product,
            "script": script,
            "voice_file": voice_path,
            "final_file": final_path,
            "timestamp": datetime.now().isoformat()
        }

        save_history(entry)

        return {
            "script": script,
            "audio_file": final_path
        }

    except Exception as e:
        return {"error": str(e)}
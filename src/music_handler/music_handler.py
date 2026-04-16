
import os
import random

def get_music_by_context(intent: str, mood: str) -> str:
    """
    Select music dynamically from folder based on mood + intent
    """

    project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    base_path = os.path.join(project_root, "outputs", "music")

    # 🧠 Intent overrides mood (important)
    if intent == "podcast":
        mood = "calm"
    elif intent == "story":
        mood = "cinematic"

    mood_folder = os.path.join(base_path, mood)

    if not os.path.exists(mood_folder):
        print(f"[Music Error]: Folder not found -> {mood_folder}")
        return ""

    # 🎵 get all mp3 files
    files = [f for f in os.listdir(mood_folder) if f.endswith(".mp3")]

    if not files:
        print(f"[Music Error]: No music files inside {mood_folder}")
        return ""

    # 🎯 random selection
    selected_file = random.choice(files)

    full_path = os.path.join(mood_folder, selected_file)

    return full_path
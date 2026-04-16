# src/music/mood_detector.py

def detect_mood(user_input: str) -> str:
    text = user_input.lower()

    if any(word in text for word in ["fast", "exciting", "offer", "sale"]):
        return "upbeat"

    elif any(word in text for word in ["calm", "relax", "meditation", "peace"]):
        return "calm"

    elif any(word in text for word in ["story", "dark", "emotional"]):
        return "cinematic"

    else:
        return "upbeat"
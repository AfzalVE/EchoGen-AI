# src/agent.py

import os
from datetime import datetime

from src.script_generator import generate_script
from src.voice_generator import generate_voice_segment
from src.audio_merger import merge_audio, merge_voice_segments
from src.music_handler.music_handler import get_music_by_context
from src.music_handler.mood_detector import detect_mood
from src.utils.history import save_history


# 🔧 Normalize path → outputs/xxx → xxx
def normalize_path(path: str) -> str:
    if not path:
        return ""
    path = path.replace("\\", "/")
    return path.split("outputs/")[-1] if "outputs/" in path else path


# 🧠 Detect intent
def detect_intent(user_input: str) -> str:
    text = user_input.lower()

    if "podcast" in text:
        return "podcast"
    elif "story" in text:
        return "story"
    elif "ad" in text or "product" in text:
        return "ad"
    else:
        return "ad"


# 🎭 Convert script → dialogue
def build_dialogue(script: str):
    lines = script.split("\n")
    dialogue = []

    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue

        speaker = None

        if ":" in line:
            parts = line.split(":", 1)
            label = parts[0].lower().strip()
            text = parts[1].strip()

            if label in ["customer", "narrator"]:
                speaker = label
                line = text

        if not speaker:
            speaker = "customer" if i % 2 == 0 else "narrator"

        dialogue.append({
            "speaker": speaker,
            "text": line
        })

    return dialogue


# 🧠 Enhance text
def enhance_text(text: str) -> str:
    text = text.replace(",", "... ")
    text = text.replace(" and ", "... and ")
    return text


# 🚀 MAIN AGENT
def run_agent(user_input: str, voice_file: str, final_file: str):

    intent = detect_intent(user_input)

    # 🧠 Script generation
    if intent == "ad":
        script = generate_script(user_input)
    elif intent == "podcast":
        script = generate_script(f"Podcast intro about {user_input}")
    elif intent == "story":
        script = generate_script(f"Short storytelling narration about {user_input}")
    else:
        script = generate_script(user_input)

    # 🎭 Dialogue
    dialogue = build_dialogue(script)

    segment_paths = []

    # 🎙️ Generate segments
    for i, part in enumerate(dialogue):
        filename = f"segment_{i}.mp3"

        enhanced = enhance_text(part["text"])

        path = generate_voice_segment(
            text=enhanced,
            speaker=part["speaker"],
            filename=filename
        )

        if isinstance(path, dict) and "error" in path:
            save_history({
                "input": user_input,
                "error": path["error"],
                "details": path.get("details"),
                "timestamp": datetime.now().isoformat()
            })
            return path

        # fallback (unexpected failure)
        if not path:
            save_history({
                "input": user_input,
                "error": "Voice generation failed",
                "timestamp": datetime.now().isoformat()
            })
            return {"error": "Voice generation failed"}

        segment_paths.append(path)

    # 🎧 Merge voice segments
    texts = [part["text"] for part in dialogue]
    combined_voice = merge_voice_segments(segment_paths, texts)

    # 💾 SAVE combined voice file
    project_root = os.path.dirname(os.path.dirname(__file__))
    voice_output_path = os.path.join(project_root, "outputs", "voice", voice_file)
    os.makedirs(os.path.dirname(voice_output_path), exist_ok=True)

    combined_voice.export(voice_output_path, format="mp3")

    # 🎵 Music
    mood = detect_mood(user_input)
    music_path = get_music_by_context(intent, mood)

    if not music_path:
        save_history({
            "input": user_input,
            "error": "Music selection failed",
            "timestamp": datetime.now().isoformat()
        })
        return {"error": "Music selection failed"}

    # 🎧 Final merge
    final_path = merge_audio(
        voice_audio=combined_voice,
        music_path=music_path,
        output_filename=final_file
    )

    # 🔧 Normalize paths
    voice_rel = normalize_path(voice_output_path)
    final_rel = normalize_path(final_path)

    # 🧾 Save history
    entry = {
        "input": user_input,
        "intent": intent,
        "mood": mood,
        "script": script,
        "dialogue": dialogue,
        "segments": len(segment_paths),
        "voice_file": voice_rel,
        "final_file": final_rel,
        "timestamp": datetime.now().isoformat()
    }

    save_history(entry)

    # 🎯 Response (clean paths)
    return {
        "intent": intent,
        "mood": mood,
        "script": script,
        "segments": len(segment_paths),
        "voice_file": voice_rel,
        "final_file": final_rel
    }
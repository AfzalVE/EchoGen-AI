# src/agent.py

from src.script_generator import generate_script
from src.voice_generator import generate_voice_segment
from src.audio_merger import merge_audio, merge_voice_segments
from src.music_handler.music_handler import get_music_by_context
from src.music_handler.mood_detector import detect_mood


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


# 🎭 NEW: convert script → dialogue
def build_dialogue(script: str):
    lines = script.split("\n")

    dialogue = []

    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue

        speaker = "customer" if i % 2 == 0 else "narrator"

        dialogue.append({
            "speaker": speaker,
            "text": line
        })

    return dialogue

def enhance_text(text: str) -> str:
    text = text.replace(",", "... ")
    text = text.replace(" and ", "... and ")
    return text

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

    # 🎭 Convert to dialogue
    dialogue = build_dialogue(script)

    segment_paths = []

    # 🎙️ Generate multiple voice segments
    for i, part in enumerate(dialogue):
        filename = f"segment_{i}.mp3"

        # 🧠 enhance text BEFORE TTS
        enhanced = enhance_text(part["text"])

        path = generate_voice_segment(
        text=enhanced,
        speaker=part["speaker"],
        filename=filename
    )

        if not path:
            return {"error": "Voice generation failed"}

        segment_paths.append(path)

    # 🎧 Merge all voice segments
    texts = [part["text"] for part in dialogue]

    combined_voice = merge_voice_segments(segment_paths, texts)

    # 🎵 Music selection
    mood = detect_mood(user_input)
    music_path = get_music_by_context(intent, mood)

    if not music_path:
        return {"error": "Music selection failed"}

    # 🎧 Final merge
    final_path = merge_audio(
        voice_audio=combined_voice,
        music_path=music_path,
        output_filename=final_file
    )

    return {
        "intent": intent,
        "mood": mood,
        "script": script,
        "segments": len(segment_paths),
        "final_file": final_path
    }
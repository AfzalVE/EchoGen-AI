import os
import random
from pydub import AudioSegment

# FFmpeg setup
project_root = os.path.dirname(os.path.dirname(__file__))
ffmpeg_dir = os.path.join(project_root, "ffmpeg", os.listdir("ffmpeg")[0], "bin")
os.environ["PATH"] += os.pathsep + ffmpeg_dir
os.environ["FFMPEG_BINARY"] = os.path.join(ffmpeg_dir, "ffmpeg.exe")
os.environ["FFPROBE_BINARY"] = os.path.join(ffmpeg_dir, "ffprobe.exe")
AudioSegment.converter = os.path.join(ffmpeg_dir, "ffmpeg.exe")
AudioSegment.ffprobe   = os.path.join(ffmpeg_dir, "ffprobe.exe")



# 🎙️ NEW: merge multiple voice segments
def merge_voice_segments(segment_paths, texts):
    """
    Merge dialogue with smart pauses
    """

    final_voice = AudioSegment.empty()

    for i, path in enumerate(segment_paths):
        segment = AudioSegment.from_file(path)

        # 🔊 Slight normalization
        segment = segment + 2

        # 🎧 Add small fade (removes harsh cuts)
        segment = segment.fade_in(100).fade_out(150)

        # 🧠 Smart pause
        pause_duration = get_pause_duration(texts[i])
        pause = AudioSegment.silent(duration=pause_duration)

        final_voice += segment + pause

    return final_voice


def get_pause_duration(text: str) -> int:
    """
    Decide pause duration based on sentence style
    """

    text = text.strip()

    if text.endswith("?"):
        return 600   # question pause
    elif text.endswith("!"):
        return 500   # energetic
    elif len(text.split()) <= 3:
        return 700   # short punch line
    else:
        return 400   # normal


# 🎧 FINAL MERGER (voice + music)
def merge_audio(voice_audio: AudioSegment, music_path: str, output_filename: str = "final.mp3") -> str:

    project_root = os.path.dirname(os.path.dirname(__file__))

    music_abs = os.path.join(project_root, music_path.lstrip('/')) if music_path else ''

    if not os.path.exists(music_abs):
        print(f"[Merger Error]: Music file not found - {music_abs}")
        return ""

    # 🎧 Load music
    music = AudioSegment.from_file(music_abs)

    # 🔊 Balance
    voice = voice_audio + 5
    music = music - 18

    # ⏱️ Add intro delay
    silence = AudioSegment.silent(duration=800)
    voice = silence + voice

    # 🎯 Target duration
    target_duration = len(voice) + 1500

    # 🎵 Random segment selection
    if len(music) > target_duration:
        start = random.randint(0, len(music) - target_duration)
        music = music[start:start + target_duration]
    else:
        repeat = target_duration // len(music) + 1
        music = (music * repeat)[:target_duration]

    # 🎵 Smooth edges
    music = music.fade_in(1200).fade_out(1200)

    # 🎙️ Overlay
    combined = music.overlay(voice)

    # 🎵 Final fade
    combined = combined.fade_out(2000)

    # 📁 Save
    final_dir = os.path.join(project_root, 'outputs', 'final')
    os.makedirs(final_dir, exist_ok=True)

    output_path = os.path.join(final_dir, output_filename)
    combined.export(output_path, format="mp3")

    return output_path
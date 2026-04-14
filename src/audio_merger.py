import os
from pydub import AudioSegment

# Keep your FFmpeg setup as-is
project_root = os.path.dirname(os.path.dirname(__file__))
ffmpeg_dir = os.path.join(project_root, "ffmpeg", "ffmpeg-8.0.1-essentials_build", "bin")

AudioSegment.converter = os.path.join(ffmpeg_dir, "ffmpeg.exe")
AudioSegment.ffprobe   = os.path.join(ffmpeg_dir, "ffprobe.exe")


def merge_audio(voice_path: str, music_path: str, output_filename: str = "final.mp3") -> str:

    project_root = os.path.dirname(os.path.dirname(__file__))

    voice_abs = os.path.join(project_root, voice_path.lstrip('/')) if voice_path else ''
    music_abs = os.path.join(project_root, music_path.lstrip('/')) if music_path else ''

    if not os.path.exists(voice_abs) or not os.path.exists(music_abs):
        print(f"[Merger Error]: Input files not found - voice: {voice_abs}, music: {music_abs}")
        return ""

    # 🎧 Load audio
    voice = AudioSegment.from_file(voice_abs)
    music = AudioSegment.from_file(music_abs)

    # 🔊 Balance volumes (VERY IMPORTANT)
    voice = voice + 5        # boost clarity
    music = music - 20       # background level

    # 🎵 Add intro (music starts first)
    intro = music[:2000].fade_in(1500)

    # ⏱️ Add slight delay to voice (natural feel)
    silence = AudioSegment.silent(duration=1000)
    voice = silence + voice

    # 🔁 Loop music instead of silence padding
    if len(music) < len(voice):
        repeat = len(voice) // len(music) + 1
        music = music * repeat

    # ✂️ Trim to match voice
    music = music[:len(voice)]

    # 🎙️ Overlay (IMPORTANT: music base, voice on top)
    combined = music.overlay(voice)

    # 🎵 Smooth ending
    combined = combined.fade_out(2000)

    # 🎯 Add intro
    final_audio = intro + combined

    # 📁 Save output
    final_dir = os.path.join(project_root, 'outputs', 'final')
    os.makedirs(final_dir, exist_ok=True)

    output_path = os.path.join(final_dir, output_filename)
    final_audio.export(output_path, format="mp3")

    return output_path
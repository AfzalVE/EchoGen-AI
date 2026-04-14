# src/music_handler.py

import os


def get_music_file(filename: str = "music.mp3") -> str:
    """
    Retrieve path of music file.

    Args:
        filename (str): Music file name

    Returns:
        str: Path to music file
    """

    # Absolute path from project root
    project_root = os.path.dirname(os.path.dirname(__file__))
    path = os.path.join(project_root, 'outputs', 'music', filename)

    if not os.path.exists(path):
        print(f"[Music Error]: File not found -> {path}")
        return ""

    return path

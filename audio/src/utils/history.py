import json
import os
from datetime import datetime

# 📁 Absolute base path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
HISTORY_FILE = os.path.join(BASE_DIR, "outputs", "history.json")

MAX_HISTORY = 100  # keep last 100 entries


# 🔧 Normalize path → outputs/xxx → xxx
def normalize_path(path: str) -> str:
    if not path:
        return ""

    path = path.replace("\\", "/")

    if "outputs/" in path:
        return path.split("outputs/")[-1]

    return path


def save_history(entry):
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)

    # 🔒 Ensure timestamp
    if "timestamp" not in entry:
        entry["timestamp"] = datetime.now().isoformat()

    # ✅ FIX: Normalize file paths BEFORE saving
    if "voice_file" in entry:
        entry["voice_file"] = normalize_path(entry["voice_file"])

    if "final_file" in entry:
        entry["final_file"] = normalize_path(entry["final_file"])

    # 🛡️ Safe read
    try:
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        else:
            data = []
    except Exception:
        print("[History Warning]: Corrupted file, resetting...")
        data = []

    # ➕ Add new entry
    data.append(entry)

    # 🔥 Limit size
    data = data[-MAX_HISTORY:]

    # 💾 Save safely
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)

        print("✅ History saved at:", HISTORY_FILE)

    except Exception as save_error:
        print("❌ History save FAILED:", str(save_error))
        import traceback
        traceback.print_exc()


def get_history_data():
    try:
        if not os.path.exists(HISTORY_FILE):
            return []

        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    except Exception:
        print("[History Error]: Failed to read history")
        return []


def clear_history():
    try:
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)
    except Exception:
        print("[History Error]: Failed to clear history")
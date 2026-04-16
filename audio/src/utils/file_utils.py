import uuid
from datetime import datetime

def generate_unique_name(prefix="audio"):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:6]
    return f"{prefix}_{timestamp}_{unique_id}.mp3"
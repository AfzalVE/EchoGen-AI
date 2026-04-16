def get_voice_for_speaker(speaker: str):
    """
    Assign different voice styles
    """

    if speaker == "customer":
        return {
            "speed": 1.0,
            "pitch": "normal"
        }

    elif speaker == "narrator":
        return {
            "speed": 1.1,
            "pitch": "slightly_deep"
        }

    return {}
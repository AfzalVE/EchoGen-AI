def build_dialogue(script: str):
    """
    Convert script into dialogue format
    """

    lines = script.split("\n")

    dialogue = []

    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue

        if i % 2 == 0:
            speaker = "customer"
        else:
            speaker = "narrator"

        dialogue.append({
            "speaker": speaker,
            "text": line
        })

    return dialogue
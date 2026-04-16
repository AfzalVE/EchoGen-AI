# src/script_generator.py

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_script(topic: str, tone: str = "engaging", max_words: int = 50) -> str:
    """
    Generate a short script based on topic.

    Args:
        topic (str): Topic of the script
        tone (str): Tone (engaging, professional, emotional, etc.)
        max_words (int): Max word limit

    Returns:
        str: Generated script
    """

    prompt = f"""
    Write a {tone} audio script about: {topic}.
    Keep it under {max_words} words.
    Make it suitable for voice narration.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-5-nano",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"[Script Generator Error]: {e}")
        return ""
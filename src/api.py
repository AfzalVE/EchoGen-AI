# src/api.py
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from src.agent import run_agent
from src.utils.file_utils import generate_unique_name
from src.utils.history import save_history, get_history_data

app = FastAPI()


# 📦 Request schemas
class AdRequest(BaseModel):
    product: str


class AgentRequest(BaseModel):
    input: str


# 🏠 Health check
@app.get("/")
def home():
    return {"message": "Audio AI Agent is running 🚀"}


# 🧾 Get history
@app.get("/history")
def history():
    return get_history_data()


# 🎯 Old endpoint (kept for backward compatibility)
@app.post("/generate-ad")
def generate_ad(request: AdRequest):
    try:
        voice_file = generate_unique_name("voice")
        final_file = generate_unique_name("final")

        result = run_agent(
            user_input=request.product,
            voice_file=voice_file,
            final_file=final_file
        )

        if "error" in result:
            return result

        entry = {
            "type": "ad",
            "input": request.product,
            "script": result["script"],
            "voice_file": result["voice_file"],
            "final_file": result["final_file"],
            "timestamp": datetime.now().isoformat()
        }

        save_history(entry)

        return result

    except Exception as e:
        return {"error": str(e)}


# 🧠 MAIN AGENT ENDPOINT
@app.post("/agent")
def agent(request: AgentRequest):
    try:
        # 🆔 Unique filenames
        voice_file = generate_unique_name("voice")
        final_file = generate_unique_name("final")

        # 🧠 Run intelligent agent
        result = run_agent(
            user_input=request.input,
            voice_file=voice_file,
            final_file=final_file
        )

        if "error" in result:
            return result

        # 🧾 Save history
        entry = {
            "type": "agent",
            "input": request.input,
            "intent": result["intent"],
            "script": result["script"],
            "voice_file": result["voice_file"],
            "final_file": result["final_file"],
            "timestamp": datetime.now().isoformat()
        }

        save_history(entry)

        return result

    except Exception as e:
        return {"error": str(e)}
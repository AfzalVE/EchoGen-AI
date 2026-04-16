from fastapi import FastAPI
from pydantic import BaseModel
import uuid
from src.agent import run_agent
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.utils.file_utils import generate_unique_name
from src.utils.history import save_history, get_history_data, clear_history

app = FastAPI()

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 📦 Request schemas
class AdRequest(BaseModel):
    product: str


class AgentRequest(BaseModel):
    input: str


# 🏠 Health check
@app.get("/")
def home():
    return {"message": "Audio AI Agent is running 🚀"}


# 🔧 Convert stored path → usable URL
def add_base_url(item):
    if "voice_file" in item:
        item["voice_file"] = f"/outputs/{item['voice_file']}"
    if "final_file" in item:
        item["final_file"] = f"/outputs/{item['final_file']}"
    return item


# 🧾 Get history
@app.get("/history")
def history():
    data = get_history_data()
    return [add_base_url(item) for item in data]


@app.delete("/history")
def delete_history():
    clear_history()
    return {"message": "History cleared"}


# 🎯 Old endpoint
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
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details")
            }

        return {
            "script": result["script"],
            "audio_file": f"/outputs/{result['final_file']}"
        }

    except Exception as e:
        return {"error": str(e)}


# 🧠 MAIN AGENT ENDPOINT
@app.post("/agent")
def agent(request: AgentRequest):
    try:
        voice_file = generate_unique_name("voice")
        final_file = generate_unique_name("final")

        result = run_agent(
            user_input=request.input,
            voice_file=voice_file,
            final_file=final_file
        )

        if "error" in result:
            return {
                "success": False,
                "error": result["error"],
                "details": result.get("details")
    }

        return {
            "script": result["script"],
            "intent": result["intent"],
            "audio_file": f"/outputs/{result['final_file']}"
        }

    except Exception as e:
        return {"error": str(e)}

# 🎧 SonicAgent AI

An intelligent AI-powered audio generation system that converts text into high-quality audio ads, stories, and podcasts with background music, voice synthesis, and smart dialogue structuring.

---

## 🚀 Overview

SonicAgent AI is a full-stack application that transforms user input into engaging audio content. It combines script generation, voice synthesis, and audio merging to create production-ready audio outputs.

The system supports multiple content types such as advertisements, storytelling, and podcast-style narration using an intelligent agent-based architecture.

---

## ✨ Features

- 🧠 AI-powered script generation
- 🎙️ Multi-speaker voice synthesis (Narrator / Customer)
- 🎧 Background music integration based on mood & intent
- 🔀 Smart dialogue generation from script
- 📁 Organized audio storage (voice + final outputs)
- 📜 History tracking with clean relative paths
- ⚡ FastAPI backend with modular architecture
- 🎨 Modern React frontend UI
- 🔔 Custom notification system (no alerts)
- ❌ Error handling (API key, voice issues, failures)
- 🧩 Modular agent-based design
- 🖥️ Local LLM support using Claude + Ollama

---

## 🏗️ Tech Stack

### Backend
- Python
- FastAPI
- Pydub (Audio Processing)
- ElevenLabs API (Voice Generation)
- OpenAI API (Script Generation)

### Frontend
- React.js
- Tailwind CSS

### AI / Models
- Claude (via Ollama - local setup)
- GPT (for script generation)

---

## 📂 Project Structure

```

src/
│
├── api.py                  # FastAPI routes
├── agent.py                # Core AI agent logic
│
├── script_generator.py     # Script generation (LLM)
├── voice_generator.py      # Voice synthesis
├── audio_merger.py         # Audio + music merging
│
├── music_handler/
│   ├── music_handler.py    # Music selection
│   └── mood_detector.py    # Mood detection
│
├── utils/
│   ├── history.py          # History management
│   └── file_utils.py       # File naming utilities
│
outputs/
├── voice/                  # Raw generated voice files
├── final/                  # Final merged audio
├── music/                  # Background music
└── history.json            # Stored history

````

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sonic-agent-ai.git
cd sonic-agent-ai
````

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file:

```
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

### 4. Run Backend

```bash
uvicorn src.api:app --reload
```

---

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 How It Works

1. User enters input (product / idea)
2. Agent detects intent (ad, story, podcast)
3. Script is generated using LLM
4. Script is converted into dialogue
5. Voice is generated for each segment
6. Segments are merged into a single voice track
7. Background music is selected based on mood
8. Final audio is generated and saved
9. History is stored with relative paths

---

## 🔌 API Endpoints

### POST `/generate-ad`

Generate an audio ad

```json
{
  "product": "Create an ad for my ecommerce store"
}
```

### POST `/agent`

Run full intelligent agent

```json
{
  "input": "Tell a story about space"
}
```

### GET `/history`

Fetch generated history

### DELETE `/history`

Clear history

---

## 📁 Output Format

```json
{
  "script": "...",
  "intent": "ad",
  "audio_file": "/outputs/final/final_xxx.mp3"
}
```

---

## ❗ Error Handling

* Voice generation failure
* API key issues (expired / invalid)
* Missing music files
* System-level failures

Errors are:

* Stored in history
* Displayed in frontend (notification system)
* Do NOT include audio files

---

## 🎨 Frontend Highlights

* Clean modern UI
* Audio preview player
* Download functionality
* Recent history section
* Smart error notifications (no alerts)

---

## 🔮 Future Improvements

* 🔁 Regenerate audio feature
* 🎚️ Voice customization (pitch, speed)
* 🌍 Multi-language support
* ☁️ Cloud storage integration
* 🎛️ Advanced audio controls
* 📊 Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built by Afzal & Arijit

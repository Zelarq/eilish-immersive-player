# Billie Eilish Immersive Player

A gorgeous, responsive 3-pane interactive music and video dashboard built with **React (Vite)** and **FastAPI (Python)**. The player is customized around a premium slate-blue/navy color theme and features synchronized scrolling lyrics, a custom YouTube IFrame controller, and an automatic HTML5 audio visualizer fallback.

---

## 🚀 Key Features

* **3-Pane Split Desktop Dashboard**:
  * **Pane 1 (20% - Left Sidebar)**: Track selection library containing 25 of Billie Eilish's major songs, featuring vinyl-style rotating cover cards.
  * **Pane 2 (62% - Center Stage)**: High-performance YouTube Player or Vinyl Audio fallbacks. Clicking toggles play/pause with a visual pulse indicator.
  * **Pane 3 (38% - Right Stage)**: Synced lyrics styled in elegant bold and italic *Beau Rivage* typography + curated track trivia.
* **Focal Shift sliding transitions**: Clicking the inactive panel seamlessly slides it into the primary center focus (62% width) while shifting the other to the side.
* **Forced 480p YouTube Resolution**: The player API is programmed to strictly request `'large'` (480p) streams to optimize bandwidth and maintain playback speed.
* **HTML5 Audio Fallback**: If a YouTube official audio stream is blocked (e.g. UMG embedding restrictions), the player automatically triggers a local HTML5 `<audio>` fallback. It displays a spinning vinyl record and an animated frequency equalizer while keeping lyrics scrolling and in-sync.
* **Offline-Friendly Local SVG Covers**: Custom, high-fidelity SVG cover designs are generated locally inside `public/covers/` for 100% reliable loading.
* **Global Hotkeys**: Global spacebar binder dynamically triggers play/pause.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Vanilla CSS, Lucide Icons.
* **Backend**: FastAPI (Python), Uvicorn.
* **APIs**: YouTube IFrame Player API.

---

## 📦 Installation & Setup

### 1. Prerequisiets
* Python 3.8+
* Node.js (v20+)

### 2. Backend Server Setup
Navigate into the `backend/` directory:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*The API server will launch at `http://localhost:8000`*

### 3. Frontend Web Setup
Navigate into the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
*The Vite development server will launch at `http://localhost:3000`*

---

## 📂 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI endpoints and track metadata database
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/              # Static files & generated SVG cover arts
│   ├── src/
│   │   ├── components/      # React layout panels (Sidebar, Player, Lyrics)
│   │   ├── hooks/           # useYoutubePlayer custom synchronization hook
│   │   ├── index.css        # Navy/slate core variables and transition styles
│   │   └── App.jsx          # Main application orchestrator
│   ├── index.html
│   └── package.json
└── .gitignore               # Excludes large binaries & packages
```

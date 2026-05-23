"""时空印记 — FastAPI Backend.

Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from starlette.formparsers import MultiPartParser

# Increase multipart part size limit: 1MB → 10MB (for base64 photos)
MultiPartParser.max_part_size = 10 * 1024 * 1024  # 10MB

from database import init_db
from routers import collectibles, location, generate, qrcode

app = FastAPI(title="时空印记 API", version="1.0.0")

# CORS — allow Expo dev clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files — serve uploaded photos
uploads_dir = Path(__file__).parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Routers
app.include_router(collectibles.router)
app.include_router(location.router)
app.include_router(generate.router)
app.include_router(qrcode.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok"}

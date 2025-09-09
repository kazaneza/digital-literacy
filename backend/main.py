from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv
from routes.assessment import router as assessment_router

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Literacy Assessment API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# Include routers
app.include_router(assessment_router)

@app.get("/")
async def root():
    return {
        "message": "AI Literacy Assessment API v2.0", 
        "assessments": ["prompt_engineering", "writing_automation"],
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "openai_configured": bool(openai.api_key),
        "version": "2.0.0"
    }
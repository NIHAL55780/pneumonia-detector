import io
from pathlib import Path

import torch
import torch.nn as nn
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from torchvision import transforms

from model import get_model

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = get_model().to(device)
MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "best_model.pth"
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5,0.5,0.5], [0.5,0.5,0.5])
])

@app.get("/")
def home():
    return {"message": "Welcome to the Pneumonia Detection API."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        image = transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            output = model(image)
            output = torch.sigmoid(output)
            confidence = (output > 0.5).float().item()
            
        prediction = "PNEUMONIA" if confidence >= 0.5 else "NORMAL"
        
        return {
            "prediction": prediction,
            "confidence": confidence
        }
    
    except Exception as e:
        return {"error": str(e)}
            
import torch
import torch.nn as nn
from fastapi import FastAPI , File , UploadFile
from PIL import Image
import io
from model import get_model
from torchvision import transforms

app = FastAPI()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = get_model().to(device)
model.load_state_dict(torch.load("best_model.pth", map_location=device))
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
            
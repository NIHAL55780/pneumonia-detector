import torch
from model import get_model
from dataset import get_data_loaders
import kagglehub
from sklearn.metrics import confusion_matrix, classification_report
import numpy as np

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 🔹 Load dataset
path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")
_, val_loader = get_data_loaders(path)

# 🔹 Load model
model = get_model().to(device)
model.load_state_dict(torch.load("pneumonia_model.pth"))
model.eval()

correct = 0
total = 0
print("Starting evaluation...")
all_preds = []
all_labels = []
with torch.no_grad():
    for images, labels in val_loader:
        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)
        preds = (outputs > 0.5).float().squeeze()

        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())
        
cm = confusion_matrix(all_labels, all_preds)
print("Confusion Matrix:\n", cm)

print("\nClassification Report:\n")
print(classification_report(all_labels, all_preds))

print("Finished evaluation")

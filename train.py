import torch
import torch.nn as nn
import torch.optim as optim
import kagglehub

from dataset import get_data_loaders
from model import get_model

# 🔹 Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 🔹 Load dataset
path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")
train_loader, val_loader = get_data_loaders(path)

# 🔹 Load model
model = get_model().to(device)

# 🔹 Loss function
criterion = nn.BCELoss()

# 🔹 Optimizer (fine-tuning)
optimizer = optim.Adam(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=0.0001
)

EPOCHS = 5

best_loss = float("inf")

for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for i, (images, labels) in enumerate(train_loader):
        images = images.to(device)
        labels = labels.float().unsqueeze(1).to(device)

        # 🔹 Forward pass
        outputs = model(images)

        # 🔹 Loss
        loss = criterion(outputs, labels)

        # 🔹 Backprop
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

        # 🔹 Progress print (every 50 batches)
        if i % 50 == 0:
            print(f"Epoch {epoch+1}, Batch {i}, Loss: {loss.item():.4f}")

    # 🔹 Average loss
    avg_loss = total_loss / len(train_loader)
    print(f"\nEpoch {epoch+1} completed, Avg Loss: {avg_loss:.4f}")

    # 🔹 Save checkpoint every epoch
    torch.save(model.state_dict(), f"pneumonia_model_epoch_{epoch+1}.pth")

    # 🔹 Save best model
    if avg_loss < best_loss:
        best_loss = avg_loss
        torch.save(model.state_dict(), "best_model.pth")
        print("🔥 Best model updated!")

print("\nTraining complete!")
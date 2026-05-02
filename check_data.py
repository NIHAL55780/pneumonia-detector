import kagglehub
from backend.dataset import get_data_loaders

# Get dataset path
path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")

# Load data
train_loader, val_loader = get_data_loaders(path)

# Check one batch
images, labels = next(iter(train_loader))

print("Image shape:", images.shape)
print("Labels:", labels[:5])
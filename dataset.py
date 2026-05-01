from torchvision import datasets, transforms
from torch.utils.data import DataLoader

def get_data_loaders(base_path,batch_size = 32): #base_path is where the dataset is located bacth_size is the number of samples per batch
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)), #makes all images the same size
        transforms.RandomHorizontalFlip(), #flips the image left right randomly so model can learn to recognize features in different orientations
        transforms.RandomRotation(10), #rotates the image randomly by up to 10 degrees
        transforms.ToTensor(),#converts image to numbers 
        transforms.Normalize([0.5], [0.5])
    ])    

    val_transform = transforms.Compose([ #no filip or rotation for validation data because we want to evaluate the model on unaltered data
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5], [0.5])
    ])
    
    train_dataset = datasets.ImageFolder(f"{base_path}/chest_xray/train", transform=train_transform) #loads the training data from the specified path and applies the transformations defined in train_transform

    val_dataset = datasets.ImageFolder(f"{base_path}/chest_xray/val", transform=val_transform) #loads the validation data from the specified path and applies the transformations defined in val_transform
    
    train_loader= DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle = True
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle = False
    )
    
    return train_loader, val_loader
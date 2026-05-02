import torch.nn as nn
from torchvision import models
from torchvision.models import resnet50, ResNet50_Weights



def get_model():
    model = resnet50(weights=ResNet50_Weights.DEFAULT) #loads a pre-trained ResNet-50 model, which has been trained on the ImageNet dataset. This allows us to leverage the learned features from that dataset for our pneumonia classification task.
    
    for param in  model.parameters():
        param.requires_grad = False #freezes the parameters of the pre-trained model, meaning that during training, only the parameters of the newly added fully connected layer will be updated. This helps to prevent overfitting and allows the model to focus on learning features specific to our pneumonia classification task.
    for param in model.layer4.parameters():
        param.requires_grad = True #unfreezes the parameters of the last convolutional block (layer4) of the ResNet-50 model, allowing them to be updated during training. This can help the model learn more task-specific features while still benefiting from the pre-trained weights in the earlier layers.
    
    in_features = model.fc.in_features #retrieves the number of input features to the fully connected layer of the ResNet-50 model. This is necessary because we will replace the original fully connected layer with a new one that has a different number of output features (in this case, 1 for binary classification).
    
    model.fc = nn.Linear(in_features, 1) #replaces the original fully connected layer of the ResNet-50 model with a new linear layer that has one output feature. This is suitable for our binary classification task (pneumonia vs. normal).
    
    return model
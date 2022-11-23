from data.prediction_result import PredictionResult
from data.training_result import TrainingResult
from ..base_model import BaseModel

class MeshCNN(BaseModel):
    def __init__(self):
        BaseModel.__init__(self, "MeshCNN")

    def predict(self, parameters, obj, xml, mtl) -> PredictionResult:
        return PredictionResult(f"{self.name} Result", f"{self.name} not implemented", [])

    def predict_log(self, params) -> str:
        return f"{self.name} not implemented"

    def train(self, params) -> TrainingResult:
        return TrainingResult(f"{self.name} not implemented")
    
    def train_log(self, params) -> str:
        return f"{self.name} not implemented"

    def train_params(self) -> dict:
        return {
        }

    def predict_params(self) -> dict:
        return {
        }
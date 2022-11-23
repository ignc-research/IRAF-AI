from data.training_result import TrainingResult
from data.prediction_result import PredictionResult

class BaseModel:
    def __init__(self, name):
        self.name = name

    def model_definition(self) -> dict:
        return {
            "name": self.name,
            "predict_parameters": self.predict_params(),
            "train_parameters": self.train_params()
        }

    def get_name(self):
        return self.name

    def predict(self, params, obj, xml, mtl=None) -> PredictionResult:
        pass
    def predict_log(self, params) -> str:
        pass
    def predict_params(self) -> dict:
        pass

    def train(self, params) -> TrainingResult:
        pass
    def train_log(self, params) -> str:
        pass
    def train_params(self) -> dict:
        pass
from email.mime import base
import os
import json

from models.capturing import Capturing
from data.training_result import TrainingResult
from ..base_model import BaseModel
from data.prediction_result import PredictionLayer, PredictionResult
from .model_code.app import predict, training
from datetime import datetime


class RegressionModel(BaseModel):
    def __init__(self):
        super().__init__("Regression")

    def change_dir(self):
        basePath = os.path.dirname(os.path.realpath(__file__))
        os.chdir(f"{basePath}/model_code")

    def train(self, params) -> TrainingResult:
        self.change_dir()
        model_name = params["model_name"]["value"]
        model_type = params["model_type"]["value"]
        num_ray = int(params["num_ray"]["value"])
        num_sensors = int(params.get("num_sensors", {}).get("value", 1))
        num_layers = int(params["num_layers"]["value"])
        activation_function = params["activation_function"]["value"]
        units = int(params["units"]["value"])
        sensor_loc_factor = int(params["sensor_loc_factor"]["value"])
        epochs = int(params["epochs"]["value"])
        xmls = json.loads(params["files_xml"]["value"])
        objs = json.loads(params["files_obj"]["value"])

        if not model_name:
            return TrainingResult("No model name given")

        with Capturing(f"data/models/{model_name}/train.txt") as log:
            training(
                xmls,
                objs,
                num_ray,
                num_sensors,
                model_name,
                model_type,
                num_layers,
                activation_function,
                units,
                sensor_loc_factor,
                epochs,
            )

        return TrainingResult(log.get_text())

    def train_log(self, params) -> str:
        self.change_dir()
        model_name = params["model_name"]["value"]
        with open(f"data/models/{model_name}/train.txt", "r") as f:
            return f.read()

    def predict(self, parameters, obj, xml, mtl) -> PredictionResult:
        self.change_dir()

        modelType = parameters["type"]["value"]
        modelName = parameters["type"]["options"][modelType]["parameters"]["name"][
            "value"
        ]
        objectName = obj["name"].replace(".obj", "")

        with Capturing(f"data/models/{modelName}/predict.txt") as log:
            result = predict(modelType, modelName, objectName, xml["file"], obj["file"])

        datestr = datetime.now().strftime("%H:%M:%S")
        xml = ""
        with open(result, "r") as file:
            xml = file.read()

        return PredictionResult(
            f"Regression {datestr}",
            f"Successfully ran prediction!\n{log.get_text()}",
            [PredictionLayer(f"{modelType}/{modelName}", xml)],
        )

    def predict_log(self, params) -> str:
        self.change_dir()
        modelType = params["type"]["value"]
        model_name = params["type"]["options"][modelType]["parameters"]["name"]["value"]
        with open(f"data/models/{model_name}/predict.txt", "r") as f:
            return f.read()

    def train_params(self) -> dict:
        return {
            "model_name": {"display": "Model Name", "type": "text", "value": ""},
            "model_type": {
                "display": "Model Type",
                "type": "select",
                "value": "fully_connected",
                "options": {
                    "fully_connected": {"display": "fully connected"},
                    "convolutional": {"display": "convolutional"},
                },
            },
            "num_ray": {"display": "Number of Rays", "type": "number", "value": "20"},
            "num_sensors": {"display": "Number of Sensors", "type": "number", "value": "1"},
            "num_layers": {
                "display": "Number of Layers",
                "type": "number",
                "value": "10",
            },
            "activation_function": {
                "display": "Activation Function",
                "type": "select",
                "value": "relu",
                "options": {
                    "relu": {"display": "relu"},
                    "tanh": {"display": "tanh"},
                    "sigmoid": {"display": "sigmoid"},
                    "softmax": {"display": "softmax"},
                    "softplus": {"display": "softplus"},
                    "softsign": {"display": "softsign"},
                },
            },
            "units": {"display": "Units", "type": "number", "value": "10"},
            "sensor_loc_factor": {
                "display": "Factor for Sensor Location",
                "type": "number",
                "value": "1",
            },
            "epochs": {"display": "Epochs", "type": "number", "value": "100"},
            "files_xml": {
                "display": "Training Files",
                "type": "multifile",
                "accept": ".xml",
                "value": "",
            },
            "files_obj": {
                "display": "Training OBJs",
                "type": "multifile",
                "accept": ".obj",
                "value": "",
            },
        }

    def predict_params(self) -> dict:
        self.change_dir()

        modelNames = {
            name: {"display": name}
            for name in os.listdir("./prediction")
            if os.path.isdir(f"./prediction/{name}") and name != "__pycache__"
        }

        return {
            "type": {
                "display": "type",
                "type": "select",
                "options": {
                    "ml": {
                        "display": "ML",
                        "parameters": {
                            "name": {
                                "display": "name",
                                "type": "select",
                                "options": modelNames,
                                "value": "fully_connected_base_model",
                            }
                        },
                    },
                    "norm": {
                        "display": "Norm",
                        "parameters": {
                            "name": {
                                "display": "name",
                                "type": "select",
                                "options": {
                                    "L1-L2": {"display": "L1-L2"},
                                    "L2": {"display": "L2"},
                                    "difflib": {"display": "difflib"},
                                    "FL": {"display": "FL"},
                                },
                                "value": "L1-L2",
                            }
                        },
                    },
                },
                "value": "ml",
            }
        }
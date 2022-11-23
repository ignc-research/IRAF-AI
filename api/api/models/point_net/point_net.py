import json
import os
import shutil


from models.capturing import Capturing
from data.prediction_result import PredictionLayer, PredictionResult
from data.training_result import TrainingResult
from ..base_model import BaseModel
from .model_code.lut import LookupTable
from .model_code.test import PoseLookup
from .model_code.train import TrainPointNet2

MODELS_DIR = "./models"

class PointNet(BaseModel):
    def __init__(self):
        BaseModel.__init__(self, "PointNet++")
        try:
            os.makedirs(os.path.join(self.get_base_path(), MODELS_DIR))
        except Exception:
            pass

    def get_base_path(self):
        basePath = os.path.dirname(os.path.realpath(__file__))
        return f"{basePath}/model_code"

    def change_dir(self):
        os.chdir(self.get_base_path())

    def get_predict_log_file(self, params):
        model_folder = params["model_name"]["value"]
        return f"{MODELS_DIR}/{model_folder}/test/log.txt"

    def predict_log(self, params) -> str:
        self.change_dir()
        with open(self.get_predict_log_file(params), 'rb') as f:
            return f.read().decode("utf-8")

    def predict(self, params, obj, xml, mtl) -> PredictionResult:
        self.change_dir()
        
        pcl_density = int(params["pcl_density"]["value"])
        crop_size = int(params["crop_size"]["value"])
        num_points = int(params["num_points"]["value"])
        obj_name = obj["name"].split(".")[0]
        model_name = params["model_name"]["value"]
        model_folder = f"{MODELS_DIR}/{model_name}"

        with Capturing(self.get_predict_log_file(params)) as log:

            self.writeFiles(f"{model_folder}/test", [obj, mtl, xml])

            # test preprocessing
            te = PoseLookup(path_data=model_folder)
            te.preprocessing(path_test_component=f'{model_folder}/test/models/{obj_name}', pcl_density=pcl_density, crop_size=crop_size, num_points=num_points)

            te.inference(data_path=model_folder, model_path=f'{model_folder}/seg_model/model1.ckpt', test_input=f'{model_folder}/test/welding_zone_test', test_one_component=f'{model_folder}/test/models/{obj_name}')
            xml = te.get_result_xml(obj_name)

            
        return PredictionResult(f"{model_name} ({pcl_density}/{crop_size}/{num_points})", log.get_text(), [PredictionLayer("Result", xml)])


    def writeFiles(self, folder, files):
        for file in files:
            fileName = file["name"]
            name = fileName.split(".")[0]
            folderPath = f"{folder}/models/{name}"
            filePath = f"{folderPath}/{fileName}"

            print(f"write {name} to {filePath}")
            try:
                os.makedirs(folderPath)
                print(f"New component {name}")
            except:
                print(f"Existing component {name}")    
            
            with open(filePath, "w") as obj_file:
                obj_file.write(file["file"])
                print(f"Wrote file {filePath}")

    def setupModelFolder(self, model_folder):
        try:
            shutil.copytree("../template", model_folder)
            os.makedirs(f"{model_folder}/test/models")
            os.makedirs(f"{model_folder}/train/models")
            print(f"Set up new model")
        except:
            print(f"Training existing model")
        
    def get_train_log_file(self, params):
        model_folder = params["model_name"]["value"]
        return f"{MODELS_DIR}/{model_folder}/train/log.txt"

    def train(self, params) -> TrainingResult:
        self.change_dir()

        model_name = params["model_name"]["value"]
        pcl_density = int(params["pcl_density"]["value"])
        crop_size = int(params["crop_size"]["value"])
        num_points = int(params["num_points"]["value"])
        max_epoch = int(params["max_epoch"]["value"])
        batch_size = int(params["batch_size"]["value"])
        learning_rate = float(params["learning_rate"]["value"])
        model_folder = f"{MODELS_DIR}/{model_name}"

        with Capturing(self.get_train_log_file(params)) as log:
            self.setupModelFolder(model_folder)
            self.writeFiles(f"{model_folder}/train", json.loads(params["files"]["value"]))

            lut = LookupTable(path_data=model_folder, label='PDL', hfd_path_classes=None, pcl_density=pcl_density, crop_size=crop_size, num_points=num_points)
            lut.make()

            tr = TrainPointNet2(path_data=model_folder)
            # # make dataset
            tr.make_dataset(crop_size=crop_size, num_points=num_points)
            # training
            print("Before train")
            tr.train(path_data=model_folder, log_dir=f'{model_folder}/seg_model', gpu=0, num_point=num_points, max_epoch=max_epoch, batch_size=batch_size, learning_rate=learning_rate)


        return TrainingResult(log.get_text())
    
    def train_log(self, params) -> str:
        self.change_dir()
        with open(self.get_train_log_file(params), 'rb') as f:
            return f.read().decode("utf-8")
        

    def train_params(self) -> dict:
        return {
            "model_name": {
                "display": "Model Name",
                "type": "text",
                "value": ""
            },
            "pcl_density": {
                "display": "Point Cloud Density",
                "type": "number",
                "value": "40"
            },
            "crop_size": {
                "display": "PCL slice edge length (mm)",
                "type": "number",
                "value": "400"
            },
            "num_points": {
                "display": "Point count in PCL slice",
                "type": "number",
                "value": "2048"
            },
            "max_epoch": {
                "display": "Max Epochs",
                "type": "number",
                "value": "100"
            },
            "batch_size": {
                "display": "Batch size",
                "type": "number",
                "value": "16"
            },
            "learning_rate": {
                "display": "Learning Rate",
                "type": "number",
                "value": "0.001"
            },
            "files": {
                "display": "Training Files",
                "type": "multifile",
                "accept": ".obj,.xml,.mtl",
                "value": ""
            }
        }

    def predict_params(self) -> dict:
        self.change_dir()
        modelNames = { name:{"display": name} for name in os.listdir(MODELS_DIR) if os.path.isdir(f"{MODELS_DIR}/{name}") }

        return {
            "model_name": {
                "display": "name",
                "type": "select",
                "options": modelNames,
                "value": "fully_connected_base_model"
            },
            "pcl_density": {
                "display": "Point Cloud Density",
                "type": "number",
                "value": "40"
            },
            "crop_size": {
                "display": "PCL slice edge length (mm)",
                "type": "number",
                "value": "400"
            },
            "num_points": {
                "display": "Point count in PCL slice",
                "type": "number",
                "value": "2048"
            },
        }
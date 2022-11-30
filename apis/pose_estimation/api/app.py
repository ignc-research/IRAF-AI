import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os.path
import importlib
from data.prediction_result import PredictionResult
from data.training_result import TrainingResult

from models.model_definitions import models

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Model training and robot frame prediction for welding robots"

@app.route("/api/Models", methods=["GET"])
def modelList():
    if request.method == "GET":
        return list(map(lambda x: x.model_definition(), models))


@app.route("/api/Training", methods=["POST"])
def training():
    if request.method == "POST":
        try:
            request_data = request.get_json()
            modelName = request_data["model"]["name"]
            result = next(x for x in models if x.name == modelName).train(request_data["model"]["train_parameters"])
            return result.to_dict()
        except Exception as e:
            return TrainingResult(f"There was an error during this training request\n {e}").to_dict()

@app.route("/api/Training/Log", methods=["POST"])
def get_training_log():
    try:
        request_data = request.get_json()
        modelName = request_data["model"]["name"]
        return json.dumps(next(x for x in models if x.name == modelName).train_log(request_data["model"]["train_parameters"]))
    except Exception as e:
        return json.dumps(f"There was an error during this predict log request\n {e}")

@app.route("/api/Prediction", methods=["POST"])
def predict():
    if request.method == "POST":
        try:
            request_data = request.get_json()
            modelName = request_data["model"]["name"]

            result = next(x for x in models if x.name == modelName).predict(request_data["model"]["predict_parameters"], request_data["obj"], request_data["xml"], request_data["mtl"])

            return result.to_dict()
        except Exception as e:
            return PredictionResult("Error", f"There was an error during this predict request\n {e}", []).to_dict()

@app.route("/api/Prediction/Log", methods=["POST"])
def get_predict_log():
    try:
        request_data = request.get_json()
        modelName = request_data["model"]["name"]
        return json.dumps(next(x for x in models if x.name == modelName).predict_log(request_data["model"]["predict_parameters"]))
    except Exception as e:
        return json.dumps(f"There was an error during this predict log request\n {e}")
        


if __name__ == "__main__":
    # predict(model="base_model", dataset_name="test_files", input_data="br")
    app.run(debug=True, host="0.0.0.0", port=5002, threaded=False, processes=8)

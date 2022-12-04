from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Generator api"

@app.route("/urdf")
def get_urdfs():
    urdfs_dir = "urdfs"
    modelNames = list(name for name in os.listdir(urdfs_dir) if os.path.isdir(f"{urdfs_dir}/{name}"))
    return modelNames

if __name__ == "__main__":
    # predict(model="base_model", dataset_name="test_files", input_data="br")
    app.run(debug=True, host="0.0.0.0", port=5003, threaded=False, processes=8)

from flask import Flask, request, send_from_directory
from flask_cors import CORS
import os
import glob
import pybullet_data

app = Flask(__name__)
CORS(app)

ASSET_PATH = "./ir_drl/assets/"
ROBOTS_PATH = os.path.join(ASSET_PATH, 'robots')
WORKSPACE_PATH = os.path.join(ASSET_PATH, 'workspace')

@app.route("/")
def home():
    return "Generator api"

def findUrdfs(search_name, path):
    files = list(glob.iglob(os.path.join(path, f"{search_name}.urdf"), recursive=True))
    return list(map(lambda x: os.path.relpath(x, path).replace(os.sep, '/'), files))

@app.route("/urdf/obstacle")
def get_obstacles_urdfs():
    return findUrdfs("**/*", WORKSPACE_PATH)  + findUrdfs("**/*", pybullet_data.getDataPath())

@app.route("/urdf/obstacle/<path:path>")
def get_obstacle_urdf(path):
    if os.path.exists(os.path.join(WORKSPACE_PATH, path)):
        return send_from_directory(WORKSPACE_PATH, path)
    else:
        return send_from_directory(pybullet_data.getDataPath(), path)

@app.route("/urdf/robot")
def get_robot_urdfs():
    return findUrdfs("**/*", ROBOTS_PATH)

@app.route("/urdf/robot/<path:path>")
def get_robot_urdf(path):
    return send_from_directory(ROBOTS_PATH, path)


if __name__ == "__main__":
    # predict(model="base_model", dataset_name="test_files", input_data="br")
    app.run(debug=True, host="0.0.0.0", port=5003)

from flask import Flask, request, send_from_directory, send_file
from flask_cors import CORS
from models.obstacle_definitions import ObstacleDefinitions
from ir_drl.shared.maze_generator import MazeGenerator
from ir_drl.shared.shelf_generator import ShelfGenerator
from helpers.fs_util import *
import os
import glob
import pybullet_data

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Generator api"

@app.route("/obstacle/<type>/<path:path>")
def get_custom_obstacle_urdf(type, path):
    if type == "human":
        return send_from_directory(HUMAN_PATH, path)
    if type == "maze":
        maze = MazeGenerator(request.args)
        file_name = maze.generate()
        return send_file(os.path.join(MAZE_PATH, file_name))
    if type == "shelf":
        shelf = ShelfGenerator(request.args)
        file_name = shelf.generate()
        return send_file(os.path.join(SHELF_PATH, file_name))
    if type == "basic":
        if os.path.exists(os.path.join(WORKSPACE_PATH, path)):
            return send_from_directory(WORKSPACE_PATH, path)
        else:
            return send_from_directory(pybullet_data.getDataPath(), path)

@app.route("/obstacle")
def get_obstacles():
    return ObstacleDefinitions().obstacle_definitions

@app.route("/urdf/robot")
def get_robot_urdfs():
    return findUrdfs("**/*", ROBOTS_PATH)

@app.route("/urdf/robot/<path:path>")
def get_robot_urdf(path):
    return send_from_directory(ROBOTS_PATH, path)


if __name__ == "__main__":
    # predict(model="base_model", dataset_name="test_files", input_data="br")
    app.run(debug=True, host="0.0.0.0", port=5003)

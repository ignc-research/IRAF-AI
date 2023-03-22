from flask import Flask, request, send_from_directory, send_file, Response
from flask_cors import CORS
from models.obstacle_definitions import obstacle_definitions
from models.robot_definitions import robot_definitions
from models.sensor_definitions import sensor_definitions
from models.goal_definitions import goal_definitions
from models.env_definition import env_definition
from ir_drl.modular_drl_env.shared.maze_generator import MazeGenerator
from ir_drl.modular_drl_env.shared.shelf_generator import ShelfGenerator
from ir_drl.modular_drl_env.shared.shape_generators import ShapeGenerator
from helpers.fs_util import *

import json
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
    args = {}
    # Parse get params
    for arg in request.args:
        args[arg] = json.loads(request.args[arg])

    if type == "human":
        return send_from_directory(HUMAN_PATH, path)
    if type == "maze" or type == "shelf":
        generator = MazeGenerator(args) if type == "maze" else ShelfGenerator(args)
        return Response(generator.generate(), mimetype="text/urdf", headers={"Content-disposition":
                 "attachment; filename=generated.urdf"}) 
    if type == "box":
        return ShapeGenerator().generate_box(**args)
    if type == "sphere":
        return ShapeGenerator().generate_sphere(**args)
    if type == "cylinder":
        return ShapeGenerator().generate_cylinder(**args)
    if type == "basic":
        if os.path.exists(os.path.join(WORKSPACE_PATH, path)):
            return send_from_directory(WORKSPACE_PATH, path)
        else:
            return send_from_directory(pybullet_data.getDataPath(), path)

@app.route("/obstacle")
def get_obstacles():
    return obstacle_definitions

@app.route("/robot")
def get_robots():
    return robot_definitions

@app.route("/environment")
def get_environment():
    return env_definition

@app.route("/sensor")
def get_sensors():
    return sensor_definitions

@app.route("/goal")
def get_goals():
    return goal_definitions

@app.route("/urdf/robot")
def get_robot_urdfs():
    return findUrdfs("**/*", ROBOTS_PATH)

@app.route("/urdf/robot/<path:path>")
def get_robot_urdf(path):
    return send_from_directory(ROBOTS_PATH, path)


if __name__ == "__main__":
    # predict(model="base_model", dataset_name="test_files", input_data="br")
    app.run(debug=True, host="0.0.0.0", port=5003)

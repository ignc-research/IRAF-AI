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
from threading import Lock
from process_manager import ProcessManager
from flask_sock import Sock
import json
import os
import glob
import pybullet_data

process_manager = ProcessManager()
# process_manager.spawn_process("./configs/sim2real_drl_karim_test.yaml", "train")

app = Flask(__name__)
sock = Sock(app)
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

@app.route("/config/<name>", methods=['GET', 'POST', 'DELETE'])
def get_config(name: str):
    if request.method == "GET":
      return json.dumps(getConfig(name))
    if request.method == "DELETE":
        deleteConfig(name)
    if request.method == "POST":
        writeConfig(name, request.json)
    return getConfigs()

@app.route("/config")
def get_configs():
    return getConfigs()

@app.route("/task")
def get_task_list():
    return process_manager.get_process_list()

@app.route("/task/<config>/<type>")
def run_task(config: str, type: str):
    return json.dumps(process_manager.spawn_process(f"./configs/{config}.yaml", type))

def handle_ws_update(ws, msg, sub):
    try:
        print(json.dumps(msg))
        ws.send(json.dumps(msg))
    except Exception as e:
        print("WS probably disconnected")
        print(e)
        sub.dispose()

@sock.route('/task/log/<id>')
def task_log(ws, id):
    p = process_manager.get_process(id)
    ws.send(json.dumps(p.log))

    sub = None
    sub = p.logline_sub.subscribe(lambda msg: handle_ws_update(ws, msg, sub))
    while True:
        ws.receive()

if __name__ == "__main__":
    # predict(model="base_model", dataset_name="test_files", input_data="br")
    app.run(debug=False, host="0.0.0.0", port=5003)

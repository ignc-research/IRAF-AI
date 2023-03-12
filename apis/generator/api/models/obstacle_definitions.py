from helpers.fs_util import *
import pybullet_data


obstacle_definitions = [
    {
        "type": "basic",
        "urdf": None,
        "urdfs": findUrdfs("**/*", WORKSPACE_PATH)  + findUrdfs("**/*", pybullet_data.getDataPath()),
        "params": {
            "move": {
                "type": "trajectory"
            }
        }
    },
    {
        "type": "human",
        "urdf": "man_visual.urdf",
        "params": {
            "move": {
                "type": "trajectory"
            }
        }
    },
    {
        "type": "shelf",
        "urdf": "shelf.urdf",
        "params": {
            "rows": {
                "type": "int",
                "value": 8
            },
            "cols": {
                "type": "int",
                "value": 8
            },
            "element_size": {
                "type": "float",
                "value": .5
            },
            "shelf_depth": {
                "type": "float",
                "value": .5
            },
            "wall_thickness": {
                "type": "float",
                "value": .1
            },
            "vel": {
              "type": "float",
              "value": 10
            },
            "move": {
                "type": "trajectory"
            }
        }
    },
    {
        "type": "maze",
        "urdf": "maze.urdf",
        "movable": True,
        "params": {
            "rows": {
                "type": "int",
                "value": 8
            },
            "cols": {
                "type": "int",
                "value": 8
            },
            "element_size": {
                "type": "float",
                "value": .5
            },
            "element_depth": {
                "type": "float",
                "value": .5
            },
            "wall_thickness": {
                "type": "float",
                "value": .1
            },
            "difficulty": {
                "type": "float",
                "value": 1
            },
            "connector_strict": {
                "type": "bool",
                "value": True
            },
            "connector_probability": {
                "type": "float",
                "value": .4
            },
            "connector_height": {
                "type": "float",
                "value": .25
            },
            "move": {
                "type": "trajectory"
            }
        }
    }]
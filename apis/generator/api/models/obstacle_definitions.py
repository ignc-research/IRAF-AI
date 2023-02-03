from helpers.fs_util import *
import pybullet_data

class ObstacleDefinitions:
    obstacle_definitions = [
        {
            "name": "basic",
            "urdf": None,
            "urdfs": findUrdfs("**/*", WORKSPACE_PATH)  + findUrdfs("**/*", pybullet_data.getDataPath()),
            "movable": True
        },
        {
            "name": "human",
            "urdf": "man.urdf",
            "movable": True
        },
        {
            "name": "shelf",
            "urdf": "shelf.urdf",
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
                "shelf_depth": {
                    "type": "float",
                    "value": .5
                },
                "wall_thickness": {
                    "type": "float",
                    "value": .1
                }
            }
        },
        {
            "name": "maze",
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
                }
            }
        }
    ]
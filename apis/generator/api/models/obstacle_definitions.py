from helpers.fs_util import *
import pybullet_data


color_param = {
              "key": "color",
              "type": "color",
              "value": [1, 1, 1, 1]
            }
move_param = {
      "key": "move",
      "type": "trajectory"
    }

radius_param = {
              "key": "radius",
              "type": "float",
              "value": 1
            }

obstacle_definitions = [
    {
        "type": "basic",
        "urdf": None,
        "urdfs": findUrdfs("**/*", WORKSPACE_PATH)  + findUrdfs("**/*", pybullet_data.getDataPath()),
        "params": [
          move_param
        ]
    },
    {
      "type": "human",
      "urdf": "man_visual.urdf",
      "params": [
          move_param
      ]
    },
    {
        "type": "box",
        "urdf": "box.urdf",
        "params": [
            {
              "key": "scale",
              "type": "vec3",
              "value": [1, 1, 1]
            },
            color_param,
            move_param
        ]
    },
    {
        "type": "sphere",
        "urdf": "sphere.urdf",
        "params": [
            radius_param,
            color_param,
            move_param
        ]
    },
    {
        "type": "cylinder",
        "urdf": "cylinder.urdf",
        "params": [
            {
              "key": "height",
              "type": "float",
              "value": 1
            },
            radius_param,
            color_param,
            move_param
        ]
    },
    {
        "type": "human",
        "urdf": "man_visual.urdf",
        "params": [
            move_param
        ]
    },
    {
        "type": "shelf",
        "urdf": "shelf.urdf",
        "params": [
            {
                "key": "rows",
                "type": "int",
                "value": 8
            },
            {
                "key": "cols",
                "type": "int",
                "value": 8
            },
            {
                "key": "element_size",
                "type": "float",
                "value": .5
            },
            {
                "key": "shelf_depth",
                "type": "float",
                "value": .5
            },
            {
                "key": "wall_thickness",
                "type": "float",
                "value": .1
            },
            {
                "key": "vel",
                "type": "float",
                "value": 10
            },
            color_param,
            move_param
        ]
    },
    {
        "type": "maze",
        "urdf": "maze.urdf",
        "movable": True,
        "params": [
            {
                "key": "rows",
                "type": "int",
                "value": 8
            },
            {
                "key": "cols",
                "type": "int",
                "value": 8
            },
           {
                "key":  "element_size",
                "type": "float",
                "value": .5
            },
            {
                "key": "element_depth",
                "type": "float",
                "value": .5
            },
            {
                "key": "wall_thickness",
                "type": "float",
                "value": .1
            },
            {
                "key": "difficulty",
                "type": "float",
                "value": 1
            },
            {
                "key": "connector_strict",
                "type": "bool",
                "value": True
            },
            {
                "key": "connector_probability",
                "type": "float",
                "value": .4
            },
            {
                "key": "connector_height",
                "type": "float",
                "value": .25
            },
            color_param,
            move_param
        ]
    }]
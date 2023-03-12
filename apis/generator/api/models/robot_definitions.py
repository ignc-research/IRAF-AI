robot_definitions = [
    {
      "type": "UR5",
      "urdf": "predefined/ur5/urdf/ur5.urdf",
      "params": {
        "control_mode": {
          "type": "int",
          "value": 0
        },
        "xyz_delta": {
          "type": "float",
          "value": 0.005
        },
        "rpy_delta": {
          "type": "float",
          "value": 0.005
        }
      }
    },
    {
      "type": "KR16",
      "urdf": "predefined/kr16/urdf/kr16.urdf",
      "params": {
        "control_mode": {
          "type": "int",
          "value": 0
        },
        "xyz_delta": {
          "type": "float",
          "value": 0.005
        },
        "rpy_delta": {
          "type": "float",
          "value": 0.005
        }
      }
    }
]
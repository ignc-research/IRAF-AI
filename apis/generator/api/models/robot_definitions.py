#0: inverse kinematics, 1: joint angles, 2: joint velocities
default_params = [
        {
          "key": "control_mode",
          "value": 0,
          "options": [
            {
              "value": 0,
              "label": "Inverse Kinematics"
            },
            {
              "value": 1,
              "label": "Joint Angles"
            },
            {
              "value": 2,
              "label": "Joint Velocities"
            }
          ]
        },
        {
          "key": "xyz_delta",
          "type": "float",
          "value": 0.005
        },
        {
          "key": "rpy_delta",
          "type": "float",
          "value": 0.005
        }
]

robot_definitions = [
    {
      "type": "UR5",
      "urdf": "predefined/ur5/urdf/ur5.urdf",
      "params": default_params
    },
    {
      "type": "KR16",
      "urdf": "predefined/kr16/urdf/kr16.urdf",
      "params": default_params
    },
    {
      "type": "UR5_Gripper",
      "urdf": "predefined/ur5/urdf/ur5_with_gripper.urdf",
      "params": default_params
    }
]
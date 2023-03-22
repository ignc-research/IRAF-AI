goal_definitions = [
    {
      "type": "PositionCollision",
      "params": [
        {
          "key": "add_to_logging",
          "type": "bool",
          "value": False
        },
        {
          "key": "continue_after_success",
          "type": "bool",
          "value": False
        },
        {
          "key": "reward_success",
          "type": "int",
          "value": 10
        },
        {
          "key": "reward_collision",
          "type": "int",
          "value": -5
        },
        {
          "key": "reward_distance_mult",
          "type": "float",
          "value": -0.01
        },
        {
          "key": "dist_threshold_start",
          "type": "float",
          "value": 0.2
        },
        {
          "key": "dist_threshold_end",
          "type": "float",
          "value": 0.01
        },
        {
          "key":  "dist_threshold_increment_start",
          "type": "float",
          "value": 0.01
        },
        {
          "key": "dist_threshold_increment_end",
          "type": "float",
          "value": 0.001
        },
        {
          "key": "dist_threshold_overwrite",
          "type": "string",
          "value": "None"
        }
      ]
    },
    {
      "type": "PositionRotationCollision",
      "params": []
    }
]
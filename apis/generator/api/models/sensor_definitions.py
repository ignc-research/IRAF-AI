sensor_definitions = [
    {
      "type": "LiDAR",
      "params": [
        {
          "key": "update_steps",
          "type": "int",
          "value": 1
        },
        {
          "key": "add_to_observation_space",
          "type": "bool",
          "value": True
        },
        {
          "key": "add_to_logging",
          "type": "bool",
          "value": True
        },
        {
          "key": "indicator_buckets",
          "type": "int",
          "value": 6
        },
        {
          "key": "ray_start",
          "type": "float",
          "value": 0
        },
        {
          "key": "ray_end",
          "type": "float",
          "value": .3
        },
        {
          "key": "indicator",
          "type": "bool",
          "value": True
        }
      ]
    },
    {
      "type": "Camera",
      "params": []
    }
]
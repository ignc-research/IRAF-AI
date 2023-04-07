env_definition = {
  "params": [
      {
          "key": "max_steps_per_episode",
          "type": "int",
          "value": 1024
      },
      {
          "key": "normalize_observations",
          "type": "bool",
          "value": False
      },
      {
          "key": "normalize_rewards",
          "type": "bool",
          "value": False
      },
      {
          "key": "stat_buffer_size",
          "type": "int",
          "value": 25
      },
      {
          "key":  "engine",
          "children": [
              {
                  "key": "type",
                  "value": "Pybullet",
                  "options": [
                    {
                      "value": "Pybullet"
                    },
                    {
                      "value": "Unity"
                    }
                  ]
              },
              {
                  "key": "gravity",
                  "type": "vec3",
                  "value": [0, 0, -9.8]
              },
              {
                  "key": "sim_step",
                  "type": "float",
                  "value": 0.00416666666
              },
              {
                  "key": "sim_steps_per_env_step",
                  "type": "int",
                  "value": 1
              },
              {
                  "key": "use_physics_sim",
                  "type": "bool",
                  "value": True
              }
          ]
      }
  ]
    
}

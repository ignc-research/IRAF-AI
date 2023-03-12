env_definition = {
    
  "params": {
      "max_steps_per_episode": {
          "type": "int",
          "value": 1024
      },
      "normalize_observations": {
          "type": "bool",
          "value": False
      },
      "normalize_rewards": {
          "type": "bool",
          "value": False
      },
      "stat_buffer_size": {
          "type": "int",
          "value": 25
      },
      "engine": {
          "type": "group",
          "children": {
              "gravity": {
                  "type": "vec3",
                  "value": [0, 0, -9.8]
              },
              "sim_step": {
                  "type": "float",
                  "value": 0.00416666666
              },
              "sim_steps_per_env_step": {
                  "type": "int",
                  "value": 1
              },
              "use_physics_sim": {
                  "type": "bool",
                  "value": True
              }
          }
      }
  }
    
}

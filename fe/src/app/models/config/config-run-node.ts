export function getDefaultRunNode() {
  return {
    load_model: false,
    model_path: './models/weights/new_model',
    train: {
      num_envs: 16,
      timesteps: 15000000,
      save_freq: 15000,
      save_folder: './models/weights',
      save_name: 'new_model',
      recurrent: false,
      ppo_steps: 1024,
      batch_size: 512,
      gamma: 0.995,
      tensorboard_folder: './models/tensorboard_logs',
      custom_policy: {
        use: true,
        activation_function: 'ReLU',
        layers: [
          256,
          256,
          { value_function: [256, 256] },
          { policy_function: [256, 256, 256] } 
        ],
        lstm: {
          lstm_hidden_size: 512,
          n_lstm_layers: 2,
          shared_lstm: false,
          enable_critic_lstm: true
        }
        }
      },
      eval: {
        max_episodes: -1,
        logging: 1,
        display_delay: 0,
        show_world_aux: false,
        show_goal_aux: true,
        show_sensor_aux: false
      }
  };
}
import { ConfigEnvNode } from './config-env-node';

export type Config = {
  env: ConfigEnvNode;
  run: {
    load_model: boolean;
    model_path: string;
    eval: {
      display_delay: number;
      logging: number;
      max_episodes: number;
      show_goal_aux: boolean;
      show_sensor_aux: boolean;
      show_world_aux: boolean;
    };
    train: {
      batch_size: number;
      gamma: number;
      num_envs: number;
      ppo_steps: number;
      recurrent: boolean;
      save_folder: string;
      save_freq: number;
      save_name: string;
      tensorboard_folder: string;
      timesteps: number;
    };
  };
};

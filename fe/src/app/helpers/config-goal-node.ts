export type ConfigGoalNode = {
  type: string;
  config: {
    add_to_logging: boolean;
    continue_after_success: boolean;
    dist_threshold_end: number;
    dist_threshold_increment_end: number;
    dist_threshold_increment_start: number;
    dist_threshold_overwrite: string;
    dist_threshold_start: number;
    reward_collision: number;
    reward_distance_mult: number;
    reward_success: number;
  };
};
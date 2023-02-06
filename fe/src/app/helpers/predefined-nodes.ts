import { GroupNode, GroupType } from "../models/group";

export function getEnvNode() {
    return new GroupNode({ name: 'Environment', type: GroupType.Environment, params: {
        "max_steps_per_episode": {
            type: 'int',
            value: 1024
        },
        "use_physics_sim": {
            type: 'bool',
            value: true
        },
        "physics_steps_per_env_step": {
            type: 'int',
            value: 1024
        },
        "sim_step": {
            type: 'float',
            value: .0041666666
        },
        "stat_buffer_size": {
            type: 'int',
            value: 25
        },
        "normalize_observations": {
            type: 'bool',
            value: false
        },
        "normalize_rewards": {
            type: 'bool',
            value: false
        }
    }});
}
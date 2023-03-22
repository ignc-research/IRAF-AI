import { Goal, IGoal } from '../goal';
import { Parameters } from '../parameters';
import { ConfigParams, ConfigParamUtils } from './config-params';
import { ConfigUtils } from './config-utils';
import { ConfigVec3 } from './config-vec3';

export type ConfigGoalNode = {
  type: string;
  config: ConfigParams;
};

export function parseGoal(goals: IGoal[], configGoal: ConfigGoalNode) {
  const goalDef = structuredClone(goals.find((x) => x.type == configGoal.type));
  if (goalDef && goalDef.params) {
    goalDef.params = ConfigParamUtils.getParams(goalDef.params, configGoal.config);
    goalDef.name = configGoal.type;

    return new Goal(goalDef);
  } else {
    throw `Config contains unknown goal type: ${
      configGoal.type
    }. Known goal types are ${goals.map((x) => x.type).join(', ')}`;
  }
}

export function exportGoal(goal: Goal): ConfigGoalNode {
  return {
    type: goal.type,
    config: ConfigParamUtils.exportParams(goal.params)
  }
}
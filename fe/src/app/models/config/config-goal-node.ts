import { Goal, IGoal } from '../goal';
import { Parameters } from '../parameters';
import { ConfigIoMessage, ConfigIoMsgType, ConfigIoResult } from './config-io-result';
import { ConfigParams, ConfigParamUtils } from './config-params';
import { ConfigUtils } from './config-utils';
import { ConfigVec3 } from './config-vec3';

export type ConfigGoalNode = {
  type: string;
  config: ConfigParams;
};

export function parseGoal(goals: IGoal[], configGoal: ConfigGoalNode): ConfigIoResult<Goal> {
  const output = new ConfigIoResult<Goal>();

  const goalDef = structuredClone(goals.find((x) => x.type == configGoal.type));
  if (goalDef && goalDef.params) {
    const params = ConfigParamUtils.getParams(goalDef.params, configGoal.config);
    output.withMessages(params.messages, `Goal ${goalDef.type}: `);
    goalDef.params = params.data;
    goalDef.name = configGoal.type;

    output.withData(new Goal(goalDef));
  } else {
    output.withMessage(new ConfigIoMessage(`Config contains unknown goal type: ${
      configGoal.type
    }. Known goal types are ${goals.map((x) => x.type).join(', ')}`, ConfigIoMsgType.ERROR));
  }

  return output;
}

export function exportGoal(goal: Goal): ConfigGoalNode {
  return {
    type: goal.type,
    config: ConfigParamUtils.exportParams(goal.params)
  }
}
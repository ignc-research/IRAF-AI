import { Goal, IGoal } from '../goal';
import { Parameters } from '../parameters';
import { ConfigIoMessage, ConfigIoMsgType, ConfigIoResult } from './config-io-result';
import { ConfigParams, ConfigParamUtils } from './config-params';
import { ConfigUtils } from './config-utils';
import { ConfigVec3 } from './config-vec3';

export type ConfigGoalNode = {
  type: string;
  position: ConfigVec3;
  rotation: ConfigVec3;
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
    goalDef.position = ConfigUtils.getThreeVec3(configGoal.position ?? [0, 0, 0]);
    goalDef.rotation = ConfigUtils.getThreeEuler(
      configGoal.rotation ?? [0, 0, 0]
    );

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
    position: ConfigUtils.getConfigVec3(goal.position),
    rotation: ConfigUtils.getConfigEuler(goal.rotation),
    config: ConfigParamUtils.exportParams(goal.params)
  }
}
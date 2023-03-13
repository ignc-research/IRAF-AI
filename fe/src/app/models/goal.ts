import { Marker } from "./marker";
import { ISceneObject } from "./scene-object";

export interface IGoal extends ISceneObject {
  type: string;
}

export class Goal extends Marker implements IGoal {
  type: string;

  constructor(obj: IGoal) {
      super(obj);
      this.type = obj.type;
  }
}


import { Group } from "three";
import { GroupNode, GroupType, IGroupNode } from "./group";
import { Marker } from "./marker";
import { ISceneObject } from "./scene-object";

export interface IEnvironment extends IGroupNode {

}

export class Environment extends GroupNode implements IEnvironment {
  constructor(obj: IEnvironment) {
      super(obj);
      this.type = GroupType.Environment;
      this.name = 'Environment';
  }
}


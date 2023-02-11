import { GroupNode, IGroupNode } from './group';
import { ISceneObject, IUrdfSceneObject, SceneObject } from './scene-object';

export interface ITrajectory extends IGroupNode {

}

export class Trajectory extends GroupNode implements ITrajectory {

    constructor(obj: ITrajectory) {
        super(obj);
    }
}


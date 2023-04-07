import { ISceneNode, SceneNode } from "./scene-node";

export class GroupNode extends SceneNode {
    type: GroupType;

    constructor(obj: IGroupNode) {
        obj.readonly = obj.readonly === undefined ? true : obj.readonly;
        super(obj);
        this.type = obj.type ?? GroupType.Default;
    }
}

export interface IGroupNode extends ISceneNode {
    type?: GroupType;
}

export enum GroupType {
    Default,
    Environment,
    Robots,
    Obstacles
}
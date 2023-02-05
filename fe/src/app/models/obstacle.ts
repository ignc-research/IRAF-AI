import { Parameters } from 'src/app/models/parameters';
import { ISceneObject, IUrdfSceneObject, SceneObject } from './scene-object';
import { SceneObjectType } from './scene-object-type';

export interface IObstacle extends ISceneObject {
    type: string;
    urdf: string;
    urdfs?: string[];
    movable: boolean;
}

export class Obstacle extends SceneObject implements IObstacle, IUrdfSceneObject {
    type: string;
    urdf: string;
    urdfs?: string[] | undefined;
    movable: boolean;

    get urdfUrl() {
        if (this.params) {
            var queryString = Object.keys(this.params).map(key => key + '=' + (this.params as any)[key].value).join('&');
            return `/obstacle/${this.type}/${this.urdf}?${queryString}`;
        }
        else {
            return `/obstacle/${this.type}/${this.urdf}`;
        }
    }

    constructor(obj: IObstacle) {
        super(obj);
        this.type = obj.type;
        this.urdf = obj.urdf;
        this.urdfs = obj.urdfs;
        this.movable = obj.movable;
    }
}


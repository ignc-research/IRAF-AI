import { Parameters } from 'src/app/models/parameters';
import { ISceneObject, IUrdfSceneObject, SceneObject } from './scene-object';
import { SceneObjectType } from './scene-object-type';

export interface IObstacle extends ISceneObject {
    type: string;
    urdf: string;
    urdfs?: string[];
}

export class Obstacle extends SceneObject implements IObstacle, IUrdfSceneObject {
    type: string;
    urdf: string;
    urdfs?: string[] | undefined;

    get urdfUrl() {
        if (this.params) {
          console.log(this.params)
            var queryString = this.params.map(param => param.key + '=' + JSON.stringify(param.value ?? null)).join('&');
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
    }
}


import { URDFLink } from "libs/urdf-loader/URDFLoader";
import { Marker } from "./marker";
import { Parameters } from "./parameters";
import { ISceneObject, IUrdfSceneObject, SceneObject } from "./scene-object";
import { SceneObjectType } from "./scene-object-type";

// ToDo: hier fehlt noch so einiges (Absprache mit Benno)
export class Robot extends SceneObject implements IUrdfSceneObject, IRobot {
    type: string;
    goalMarker!: Marker;

    get sensors(): Sensor[] {
        return this.children.filter(x => x instanceof Sensor) as Sensor[];
    }

    get urdfUrl(): string {
        return this.type;
    }

    constructor(obj: IRobot) {
        super(obj);
        this.type = obj.type;
        this.goalMarker = new Marker({name: 'goal'});
        this.addChild(this.goalMarker);
    }
}

export class Sensor extends SceneObject implements ISensor {
    type: string;
    link: string;

    constructor(obj: ISensor) {
        super(obj);

        this.type = obj.type;
        this.link = obj.link;
    }
}

export interface ISensor extends ISceneObject {
    type: string;
    link: string;
}

export interface IRobot extends ISceneObject {
    type: string;
}
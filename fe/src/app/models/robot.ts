import { URDFLink } from "libs/urdf-loader/URDFLoader";
import { Parameters } from "./parameters";
import { ISceneObject, IUrdfSceneObject, SceneObject } from "./scene-object";
import { SceneObjectType } from "./scene-object-type";

// ToDo: hier fehlt noch so einiges (Absprache mit Benno)
export class Robot extends SceneObject implements IUrdfSceneObject, IRobot {
    type: string;
    sensors: Sensor[];

    get urdfUrl(): string {
        return this.type;
    }

    constructor(obj: IRobot) {
        super(obj);

        this.type = obj.type;
        this.sensors = obj.sensors ?? [];
    }

    override invalidateRef(): void {
        super.invalidateRef();
        this.sensors.forEach(x => x.invalidateRef());
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
    sensors?: Sensor[];
}
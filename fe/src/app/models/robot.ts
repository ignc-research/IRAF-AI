import { URDFLink } from "libs/urdf-loader/URDFLoader";
import * as THREE from "three";
import { Goal } from "./goal";
import { Marker } from "./marker";
import { Parameters } from "./parameters";
import { ISceneObject, IUrdfSceneObject, SceneObject } from "./scene-object";
import { SceneObjectType } from "./scene-object-type";

// ToDo: hier fehlt noch so einiges (Absprache mit Benno)
export class Robot extends SceneObject implements IUrdfSceneObject, IRobot {
    type: string;
    urdf: string;
    goalMarker!: Marker;

    get sensors(): Sensor[] {
        return this.children.filter(x => x instanceof Sensor) as Sensor[];
    }

    get urdfUrl(): string {
      return `/urdf/robot/${this.urdf}`;
    }

    constructor(obj: IRobot) {
        super(obj);
        this.type = obj.type;
        this.urdf = obj.urdf;
        this.name = obj.name ?? obj.type;
    }
}

export class Sensor extends SceneObject implements ISensor {
    type: string;
    link: string;

    constructor(obj: ISensor) {
        super(obj);
        
        this.type = obj.type;
        this.link = obj.link;
        this.scale = new THREE.Vector3(.1,.1,.1);
        this.position = obj.position ?? new THREE.Vector3(0,0,1);
    }
}

export interface ISensor extends ISceneObject {
    type: string;
    link: string;
}

export interface IRobot extends ISceneObject {
    type: string;
    urdf: string;
}
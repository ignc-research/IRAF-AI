import * as THREE from "three";
import { ISceneObject, SceneObject } from "./scene-object";

export class Marker extends SceneObject {
    constructor(obj: ISceneObject) {
        obj.scale = obj.scale ?? new THREE.Vector3(.1,.1,.1);
        super(obj);
    }
}
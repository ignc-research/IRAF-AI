import { NgtVector3, Ref } from "@angular-three/core";
import * as THREE from "three";
import { Parameter, Parameters } from "./parameters";
import { ISceneNode, SceneNode } from "./scene-node";
import { SceneObjectType } from "./scene-object-type";

export class SceneObject extends SceneNode {

    public position: THREE.Vector3;

    public rotation: THREE.Euler;

    public scale: THREE.Vector3;

    constructor(obj: ISceneObject) {
        super(obj);
        this.position = obj.position ?? new THREE.Vector3(0,0,0);
        this.rotation = obj.rotation ?? new THREE.Euler(0,0,0);
        this.scale = obj.scale ?? new THREE.Vector3(1, 1, 1);
    }
}

export interface ISceneObject extends ISceneNode {
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
}

export interface IUrdfSceneObject {
    get urdfUrl(): string;
}
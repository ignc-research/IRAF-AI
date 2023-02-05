import { NgtVector3, Ref } from "@angular-three/core";
import * as THREE from "three";
import { Parameter, Parameters } from "./parameters";
import { SceneObjectType } from "./scene-object-type";

export class SceneObject {
    public name: string;

    public params?: Parameters;

    public ref: Ref<THREE.Object3D> = new Ref<THREE.Object3D>();

    public position: THREE.Vector3;

    public rotation: THREE.Euler;

    public scale: THREE.Vector3;

    constructor(obj: ISceneObject) {
        this.name = obj.name ?? '';
        this.params = obj.params;
        this.position = obj.position ?? new THREE.Vector3(0,0,0);
        this.rotation = obj.rotation ?? new THREE.Euler(0,0,0);
        this.scale = obj.scale ?? new THREE.Vector3(1, 1, 1);
    }

    invalidateRef() {
        this.ref = new Ref<THREE.Object3D>();
    }
}

export interface ISceneObject {
    name?: string;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    params?: Parameters;
}

export interface IUrdfSceneObject {
    get urdfUrl(): string;
}
import { Ref } from "@angular-three/core";
import * as THREE from "three";
import { Parameters } from "./parameters";

export class SceneNode {
    public name: string;

    public params?: Parameters;

    public children: SceneNode[];

    public ref: Ref<THREE.Object3D> = new Ref<THREE.Object3D>();

    constructor(obj: ISceneNode) {
        this.name = obj.name ?? '';
        this.params = obj.params;
        this.children = obj.children ?? [];
    }

    invalidateRef() {
        this.ref = new Ref<THREE.Object3D>();
        this.children.forEach(x => x.invalidateRef());
    }
}

export interface ISceneNode {
    name?: string;
    children?: SceneNode[];
    params?: Parameters;
}
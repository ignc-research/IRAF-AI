import { Ref } from "@angular-three/core";
import * as THREE from "three";
import { Parameters } from "./parameters";

export class SceneNode {
    public name: string;

    public params?: Parameters;

    public parent: SceneNode | null = null;

    public children: SceneNode[];

    public ref: Ref<THREE.Object3D> = new Ref<THREE.Object3D>();

    constructor(obj: ISceneNode) {
        this.name = obj.name ?? '';
        this.params = obj.params;
        this.children = obj.children ?? [];
    }

    removeChild(child: SceneNode) {
        const idx = this.children.indexOf(child);
        if (idx > -1) {
            this.children.splice(idx, 1);
        }
    }

    addChild(child: SceneNode) {
        child.parent = this;
        this.children.push(child);
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
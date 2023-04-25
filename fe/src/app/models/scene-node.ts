import { Ref } from "@angular-three/core";
import * as THREE from "three";
import { Parameters } from "./parameters";

export class SceneNode {
    public name: string;

    public readonly: boolean;

    public params?: Parameters;

    public parent: SceneNode | null = null;

    public children: SceneNode[];

    public ref: Ref<THREE.Object3D> = new Ref<THREE.Object3D>();

    constructor(obj: ISceneNode) {
        this.name = obj.name ?? '';
        this.readonly = obj.readonly ?? false;
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

    findRecursive(condition: (item: SceneNode) => boolean, item: SceneNode=this): SceneNode | null {
      if (condition(item)) {
        return item;
      }
      return item.children.find(x => this.findRecursive(condition, x)) ?? null;
    }
}

export interface ISceneNode {
    name?: string;
    readonly?: boolean;
    children?: SceneNode[];
    params?: Parameters;
}
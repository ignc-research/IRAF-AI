import { SceneNode } from "../models/scene-node";
import * as YAML from 'js-yaml';
import { Robot } from "../models/robot";
import * as THREE from "three";
import { GroupNode, GroupType } from "../models/group";
import { getEnvNode } from "./predefined-nodes";

export class ConfigUtils {

    getThreeVec3(param: number[]) {
        return new THREE.Vector3(param[0], param[1], param[2]);
    }

    static parseConfig(configStr?: string): SceneNode {
        const rootNode: GroupNode = getEnvNode();
        const robots: GroupNode = new GroupNode({name: 'Robots', type: GroupType.Robots});
        const obstacles: GroupNode = new GroupNode({name: 'Obstacles', type: GroupType.Obstacles});
        rootNode.addChild(robots);
        rootNode.addChild(obstacles);
        if (!configStr) {
            return rootNode;
        }
        
        const data = YAML.load(configStr, { json: true });
        console.log(data);

        return rootNode;
    }

}
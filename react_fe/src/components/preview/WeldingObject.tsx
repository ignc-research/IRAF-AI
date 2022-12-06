import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import { useThree} from "@react-three/fiber";
import * as THREE from "three";
import React, { useContext, useEffect, useState } from 'react';
import { TabContext } from "../TabContext";
import { AppSettings } from "../../AppSettings";
import { SelectedFile } from "../shared/FileSelector";

function loadMaterials(weldingMtl: string) {
    var mtlLoader = new MTLLoader();
    const mats = mtlLoader.parse(weldingMtl, './');
    return mats;
}

function loadObject(weldingObj: string, weldingMat: string) {
    if (!weldingObj) {
        return null;
    }

    var objLoader = new OBJLoader();
    objLoader.setMaterials(loadMaterials(weldingMat));
    const mesh = objLoader.parse(weldingObj);
    mesh.name = "weldingObj";
    mesh.scale.multiplyScalar(AppSettings.scaleFactor);
    return mesh;
}

function focusMesh(mesh: THREE.Group, controls: any, camera: THREE.Camera) {
    var bbox = new THREE.Box3().setFromObject(mesh);
    const center = bbox.getCenter( new THREE.Vector3() )
    controls.orbitControls.target.copy(center);
    camera.position.set(center.x, center.y, 10000 * AppSettings.scaleFactor)
    controls.orbitControls.update(); 
}

export default function WeldingObject() {
    const [state, setState] = useState<{ mesh: THREE.Group | null  }>({ mesh: null });
    const { controls, camera } = useThree();

    const tabContext = useContext(TabContext);

    useEffect(() => {
        if (!tabContext.weldingElement.obj?.file){
            return;
        }
        const mesh = loadObject(tabContext.weldingElement.obj.file, tabContext.weldingElement.mtl?.file ?? '');
        if (mesh) {
            setState({ mesh: mesh });
            focusMesh(mesh, controls, camera);
        }
    },[tabContext.weldingElement])

    if (!state.mesh) {
        return (<></>);
    }

    return (
       <primitive object={state.mesh} />
    );
}
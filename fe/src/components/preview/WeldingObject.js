import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import { useThree} from "@react-three/fiber";
import * as THREE from "three";
import React, { useContext, useEffect, useState } from 'react';
import { TabContext } from "../TabContext";
import { AppSettings } from "../../AppSettings";

function loadMaterials(weldingMtl) {
    if (!weldingMtl) {
        return null;
    }

    var mtlLoader = new MTLLoader();
    const mats = mtlLoader.parse(weldingMtl);
    return mats;
}

function loadObject(weldingObj, mats) {
    if (!weldingObj) {
        return null;
    }

    var objLoader = new OBJLoader();
    objLoader.setMaterials(loadMaterials(mats));
    const mesh = objLoader.parse(weldingObj);
    mesh.name = "weldingObj";
    mesh.scale.multiplyScalar(AppSettings.scaleFactor);
    return mesh;
}

function focusMesh(mesh, controls, camera) {
    var bbox = new THREE.Box3().setFromObject(mesh);
    const center = bbox.getCenter( new THREE.Vector3() )
    controls.orbitControls.target.copy(center);
    camera.position.set(center.x, center.y, 10000 * AppSettings.scaleFactor)
    controls.orbitControls.update(); 
}

export default function WeldingObject() {
    const [state, setState] = useState({ mesh: null, object: null, material: null });
    const { controls, camera } = useThree();

    const tabContext = useContext(TabContext);

    useEffect(() => {
        if (!tabContext.weldingElement.obj?.file){
            return;
        }
        const mesh = loadObject(tabContext.weldingElement.obj.file, tabContext.weldingElement.mtl?.file);
        setState({ mesh: mesh });
        focusMesh(mesh, controls, camera);
    },[tabContext.weldingElement])

    if (!state.mesh) {
        return (<></>);
    }

    return (
       <primitive object={state.mesh} />
    );
}
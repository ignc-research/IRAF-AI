import { useThree} from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MultiViewContext } from "../MultiViewContext";
import { TabContext } from "../TabContext";

export default function CameraController() {
    const set = useThree((state) => state.set)
    const [transform, setTransform] = useState(undefined);

    const tabContext = useContext(TabContext);
    const multiViewContext = useContext(MultiViewContext);
    
    const { camera, gl, controls } = useThree();

    const updateTransform = () => setTransform({position: camera.position, quaternion: camera.quaternion});

    const getObjName = () => tabContext.weldingElement.obj?.name;

    useEffect(() => {
        multiViewContext.cameraTransforms.registerCamera(getObjName(), camera);
        return () => multiViewContext.cameraTransforms.deregisterCamera(camera);
    }, [tabContext.weldingElement])

    useEffect(() => {
        multiViewContext.cameraTransforms.updateByName(getObjName(), camera);
    }, [transform]);


    useEffect(() => {
        if (!camera || !multiViewContext.cameraTransforms[getObjName()]) {
            return;
        }

        camera.position.copy(multiViewContext.cameraTransforms[getObjName()].position);
        camera.quaternion.copy(multiViewContext.cameraTransforms[getObjName()].quaternion);
    }, [multiViewContext.cameraTransforms]);

    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            controls.addEventListener('change', () => updateTransform())

            controls.minDistance = 10;
            controls.maxDistance = 100000;

            set({ controls: {orbitControls: controls} })
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
}
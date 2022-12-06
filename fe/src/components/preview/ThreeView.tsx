import React, { useContext, useEffect } from 'react';
import * as THREE from "three";
import WeldingObject from "./WeldingObject";
import CameraController from './CameraController';
import WeldingTorch from "./WeldingTorch";
import { useThree} from "@react-three/fiber";
import { TabContext } from '../TabContext';

function ThreeView (){
    const { camera, gl } = useThree();
    const tabContext = useContext(TabContext);

    useEffect(() => {
        if (Object.keys(tabContext.layers).length > 0 && tabContext.playingWeld && tabContext.configsDone.length >= Object.keys(tabContext.layers).filter(x => !tabContext.layers[x].hidden).length) {
            if (tabContext.selectedPoint.idx >= tabContext.playingWeld?.points.length - 2) {
                tabContext.isLoopingWeld ? null : tabContext.setPlayingWeld(tabContext.welds[(tabContext.welds.indexOf(tabContext.playingWeld) + 1) % tabContext.welds.length]);
                tabContext.setSelectedPoint({idx: 0});
            }
            else {
                tabContext.setSelectedPoint({idx: tabContext.selectedPoint.idx + 1});
            }
            tabContext.setConfigsDone([]);
        }
    }, [tabContext.configsDone])

    return (
    <>
        <CameraController />
        <ambientLight />
        <spotLight intensity={0.3} position={[5, 10, 50]} />
        <WeldingObject />
        {
            Object.keys(tabContext.layers).filter(x => !tabContext.layers[x].hidden).map((layer) => 
                (<React.Fragment key={layer}>
                    <WeldingTorch layerName={layer} />
                </React.Fragment>)
            )
        }
        
        <color attach="background" args={["black"]}/>
        <primitive object={new THREE.AxesHelper(1000)} />
    
    </>
    );

} 
export default ThreeView;
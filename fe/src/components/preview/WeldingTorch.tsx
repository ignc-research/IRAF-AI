import React, { useState, useEffect, useContext } from 'react';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { TabContext } from '../TabContext';
import { AppSettings } from '../../AppSettings';
import { TorchAnimation } from './TorchAnimation';
import { TorchAnimationHandler } from './TorchAnimationHandler';
import { MultiViewContext } from '../MultiViewContext';


function colorObject(object: THREE.Object3D, color: string) {
    object.children.forEach((x: any) => x.material = new THREE.MeshPhongMaterial({color: color}));
}

async function loadTorch(name: string, color: string) {
    var objLoader = new OBJLoader();

    const object = await objLoader.loadAsync(`/torches/${name}.obj`);
    object.name = name;
    colorObject(object, color);
    object.scale.multiplyScalar(AppSettings.scaleFactor);
    object.matrixAutoUpdate = false;
    return object;
}


function WeldingTorch (props: { layerName: string }){
    const [state, setState] = useState<{torches: { [key: string]: THREE.Group }, torchName: string | null }>({ torches: {}, torchName: null });
    const [animHandler] = useState(new TorchAnimationHandler());
    const tabContext = useContext(TabContext);
    const mvContext = useContext(MultiViewContext);

    const getColor = () => tabContext.layers[props.layerName]?.color ?? '#00ff00';
    const torchName = tabContext.playingWeld?.wkzName;
    const torch = state.torches[torchName ?? ''];

    useEffect(() => {
        if (torchName && !state.torches[torchName]) {
            loadTorch(torchName, getColor()).then(x => {
                const newState = {...state, torchName: torchName};
                newState.torches[torchName] = x;
                setState(newState);
            });
        }
        else if (torchName) {
            setState({...state, torchName: torchName});
        }
        else {
            setState({...state, torchName: null});
        }
    }, [torchName]);

    useEffect(() => {
        if (state.torchName) {
            colorObject(state.torches[state.torchName], getColor());
        }
    }, [tabContext.layers]);

    const notifyDone = () => { animHandler.stopAnimation(); tabContext.setConfigsDone(prevState => [...prevState, props.layerName]); }

    useEffect(() => {
        if (animHandler) {
            !animHandler.animation && !tabContext.paused ? notifyDone() : null;
            tabContext.paused ? animHandler.pauseAnimation() : animHandler.unpauseAnimation();
        }
    }, [tabContext.paused]);

    useEffect(() => {
        if (state.torchName && tabContext.playingWeld){             
            const currentFrame = (tabContext.playingWeld).points[tabContext.selectedPoint.idx].frames.find(x => x.name == props.layerName);
            if (!currentFrame) {
                return;
            }
            if (!tabContext.paused && tabContext.selectedPoint.idx < tabContext.playingWeld.points.length - 1 && (tabContext.playingWeld).points[tabContext.selectedPoint.idx + 1]) {
                const nextFrame = (tabContext.playingWeld).points[tabContext.selectedPoint.idx + 1].frames.find(x => x.name == props.layerName);
                if (!nextFrame) {
                    return;
                }
                animHandler.runAnimation(mvContext.animator, new TorchAnimation(currentFrame, nextFrame, state.torches[state.torchName], notifyDone, tabContext.animationSpeed));
            }
            else {
                state.torches[state.torchName].matrix = (TorchAnimation.getMatrix(currentFrame));
            }
        }

        return () => animHandler.stopAnimation();
    }, [tabContext.playingWeld, tabContext.selectedPoint, state.torchName, tabContext.animationSpeed])


    return (
    <>
        {
            torch && (<primitive  object={torch} />)
        }
    </>
    );

} 
export default WeldingTorch;
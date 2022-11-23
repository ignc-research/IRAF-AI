import React, { useState, useEffect, useContext } from 'react';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { TabContext } from '../TabContext';
import { AppSettings } from '../../AppSettings';
import { TorchAnimation } from './TorchAnimation';
import { TorchAnimationHandler } from './TorchAnimationHandler';
import { MultiViewContext } from '../MultiViewContext';


function colorObject(object, color) {
    object.children.forEach(x => x.material = new THREE.MeshPhongMaterial({color: color}));
}

async function loadTorch(name, color) {
    var objLoader = new OBJLoader();

    const object = await objLoader.loadAsync(`/torches/${name}.obj`);
    object.name = name;
    colorObject(object, color);
    object.scale.multiplyScalar(AppSettings.scaleFactor);
    object.matrixAutoUpdate = false;
    return object;
}


function WeldingTorch (props){
    const [state, setState] = useState({ torches: {}, torchName: null });
    const [animHandler] = useState(new TorchAnimationHandler());
    const tabContext = useContext(TabContext);
    const mvContext = useContext(MultiViewContext);

    const [spring, setSpring] = useSpring(() => ({
        position: [0, 0, 0],
        
        cancel: true
    }));
    
    const getColor = () => tabContext.configs[props.configName]?.color ?? '#00ff00';
    const torchName = tabContext.playingWeld?.wkzName;

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
    }, [tabContext.configs]);

    const notifyDone = () => { animHandler.stopAnimation(); tabContext.setConfigsDone(prevState => [...prevState, props.configName]); }

    useEffect(() => {
        if (animHandler) {
            !animHandler.animation && !tabContext.paused ? notifyDone() : null;
            tabContext.paused ? animHandler.pauseAnimation() : animHandler.unpauseAnimation();
        }
    }, [tabContext.paused]);

    useEffect(() => {
        if (state.torchName && tabContext.playingWeld){             
            const currentFrame = (tabContext.playingWeld).points[tabContext.selectedPoint.idx].frames.find(x => x.name == props.configName);
            if (!tabContext.paused && tabContext.selectedPoint.idx < tabContext.playingWeld.points.length - 1 && (tabContext.playingWeld).points[tabContext.selectedPoint.idx + 1]) {
                const nextFrame = (tabContext.playingWeld).points[tabContext.selectedPoint.idx + 1].frames.find(x => x.name == props.configName);
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
            state.torchName && (<animated.primitive  position={spring.position} object={state.torches[torchName]} />)
        }
    </>
    );

} 
export default WeldingTorch;
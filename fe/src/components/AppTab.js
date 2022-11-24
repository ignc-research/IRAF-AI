import React, { useContext, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ThreeView from './preview/ThreeView';
import RightPane from './right-pane/RightPane';
import { MultiViewContext } from './MultiViewContext';
import { TabContext } from './TabContext';
import LeftPane from './left-pane/LeftPane';

function AppTab(props) {
    const [activity, setActivity] = useState("");
    const [configs, setConfigs] = useState({});
    const [welds, setWelds] = useState([]);
    const [animationSpeed, setAnimationSpeed] = useState(.25);
    const [configsDone, setConfigsDone] = useState([]);
    const [playingWeld, setPlayingWeld] = useState(null);
    const [paused, setPaused] = useState(true);
    const [isLoopingWeld, setIsLoopingWeld] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState({idx: 0});

    const [weldingElement, setWeldingElement] = useState({
        obj: null,
        mtl: null
    }
    );


    const multiViewContext = useContext(MultiViewContext);
    const tabContext = {
        activity,
        setActivity,
        animationSpeed,
        setAnimationSpeed,
        configs, 
        setConfigs, 
        welds, 
        setWelds, 
        configsDone, 
        setConfigsDone,
        playingWeld,
        setPlayingWeld,
        isLoopingWeld,
        setIsLoopingWeld,
        weldingElement, 
        setWeldingElement,
        paused,
        setPaused,
        selectedPoint,
        setSelectedPoint
    };

    useEffect(() => {
        const act = `[${activity}]`;
        if (activity){
            multiViewContext.setTitle(`${multiViewContext.title} ${act}`);
        }
        else {
            multiViewContext.setTitle('IGNC');
        }
        props.updateTitle(weldingElement?.obj ? `${weldingElement?.obj?.name}${activity ? ` (${activity})` : ''}` : "(empty)");
    }, [weldingElement, activity]);


    return (
        <div className="Tab">
            <div className="Tab-body position-relative">
            <TabContext.Provider value={tabContext}>
                <LeftPane />
                <Canvas camera={{ far: 100000 }} style={{ height: '100%', width: '100%' }}>
                    <TabContext.Provider value={tabContext}>
                        <MultiViewContext.Provider value={multiViewContext}>
                            <ThreeView />
                        </MultiViewContext.Provider>
                    </TabContext.Provider>
                </Canvas>
                <RightPane />
            </TabContext.Provider>
            </div>

        </div>
    );
}

export default AppTab;
import React, { useContext, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ThreeView from './preview/ThreeView';
import RightPane from './right-pane/RightPane';
import { MultiViewContext } from './MultiViewContext';
import { TabContext } from './TabContext';
import { SelectedFile } from './shared/FileSelector';
import { LayerCollection, WeldingSeam } from './ConfigHelper';

function AppTab(props: { updateTitle: (title: string) => void }) {
    const [activity, setActivity] = useState<string>("");
    const [layers, setLayers] = useState<LayerCollection>({});
    const [welds, setWelds] = useState<WeldingSeam[]>([]);
    const [animationSpeed, setAnimationSpeed] = useState<number>(.25);
    const [configsDone, setConfigsDone] = useState<string[]>([]);
    const [playingWeld, setPlayingWeld] = useState<WeldingSeam | null>(null);
    const [paused, setPaused] = useState<boolean>(true);
    const [isLoopingWeld, setIsLoopingWeld] = useState<boolean>(false);
    const [selectedPoint, setSelectedPoint] = useState<{idx: number}>({idx: 0});

    const [weldingElement, setWeldingElement] = useState<{obj: SelectedFile | null, mtl: SelectedFile | null}>({
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
        layers, 
        setLayers, 
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
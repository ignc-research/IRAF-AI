import React from "react";
import { Layer, LayerCollection, WeldingSeam, WeldingSeamConfig } from "./ConfigHelper";
import { SelectedFile } from "./shared/FileSelector";

export const TabContext = React.createContext<TabContext>({
    activity: '',
    setActivity: () => null,

    layers: {},
    setLayers: () => null,

    welds: [],
    setWelds: () => null,

    isLoopingWeld: false,
    setIsLoopingWeld: () => null,

    configsDone: [],
    setConfigsDone: () => null,

    playingWeld: null,
    setPlayingWeld: () => null,

    selectedPoint: {idx: 0},
    setSelectedPoint: () => null,

    animationSpeed: .5,
    setAnimationSpeed: () => null,

    weldingElement: {
            obj: null,
            mtl: null
        },
    setWeldingElement: () => null,

    paused: false,
    setPaused: () => null
})

export type TabContext = {
    activity: string;
    setActivity: React.Dispatch<React.SetStateAction<string>>,

    layers: LayerCollection;
    setLayers: React.Dispatch<React.SetStateAction<LayerCollection>>;

    welds: WeldingSeam[];
    setWelds: React.Dispatch<React.SetStateAction<WeldingSeam[]>>;

    isLoopingWeld: boolean;
    setIsLoopingWeld: React.Dispatch<React.SetStateAction<boolean>>;
     
    configsDone: string[];
    setConfigsDone: React.Dispatch<React.SetStateAction<string[]>>

    playingWeld: WeldingSeam | null;
    setPlayingWeld: React.Dispatch<React.SetStateAction<WeldingSeam | null>>

    selectedPoint: { idx: number };
    setSelectedPoint: React.Dispatch<React.SetStateAction<{idx: number}>>

    animationSpeed: number;
    setAnimationSpeed: React.Dispatch<React.SetStateAction<number>>

    weldingElement: { obj: SelectedFile | null, mtl: SelectedFile | null };
    setWeldingElement: React.Dispatch<React.SetStateAction<{ obj: SelectedFile | null, mtl: SelectedFile | null }>>

    paused: boolean;
    setPaused: React.Dispatch<React.SetStateAction<boolean>>
}
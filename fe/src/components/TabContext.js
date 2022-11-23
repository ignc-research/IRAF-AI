import React from "react";

export const TabContext = React.createContext({
    activity: '',
    setActivity: () => null,

    configs: {},
    setConfigs: () => null,

    welds: [],
    setWelds: () => null,

    isLoopingWeld: [],
    setIsLoopingWeld: () => null,

    configsDone: [],
    setConfigsDone: () => null,

    playingWeld: {},
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
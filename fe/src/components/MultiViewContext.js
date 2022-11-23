import React from "react";
import { Animator } from "./preview/Animator";
import { SharedCameraTransform } from "./shared/SharedCameraTransform";

export const MultiViewContext = React.createContext({
    models: [],
    updateModels: async () => null,

    cameraTransforms: new SharedCameraTransform(),

    animator: new Animator(),

    title: '',
    setTitle: (title) => null
})
import React from "react";
import { Animator } from "./preview/Animator";
import { SharedCameraTransform } from "./shared/SharedCameraTransform";

export const MultiViewContext = React.createContext<MultiViewContext>({
    cameraTransforms: new SharedCameraTransform(),

    animator: new Animator(),

    title: '',
    setTitle: () => null,

    models: [],
    updateModels: () => null
})

export type MultiViewContext = {
    cameraTransforms: SharedCameraTransform;
    animator: Animator;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;

    models: any[];
    updateModels: () => void;
}
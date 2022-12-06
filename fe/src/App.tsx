import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'; 
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { MultiViewContext } from './components/MultiViewContext';
import { Animator } from './components/preview/Animator';
import { SharedCameraTransform } from './components/shared/SharedCameraTransform';
import { PoseEstimationApi } from './components/shared/api/PoseEstimationApi';

const App = () => {
    const [cameraTransforms] = useState(new SharedCameraTransform());
    const [animator] = useState(new Animator());
    const [models, setModels] = useState([]);
    const [title, setTitle] = useState('IGNC');

    const updateModels = async () => setModels(await new PoseEstimationApi().getModels());
    const mvContext = {
        cameraTransforms, 
        models,
        updateModels,
        animator,
        title,
        setTitle
    };

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (mvContext.models.length == 0) {
        setTimeout(async() => {
            updateModels();
        }, 0);
    }

    return (
        <MultiViewContext.Provider value={mvContext}>
            <Layout className="h-100 d-flex">
                
            </Layout>
        </MultiViewContext.Provider>
    );
}

export default App;
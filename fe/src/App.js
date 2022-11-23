import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'; 
import { useState, useEffect } from 'react';
import AppTabContainer from './components/AppTabContainer';
import Layout from './components/Layout';
import { MultiViewContext } from './components/MultiViewContext';
import { AppSettings } from './AppSettings';
import Requests from './components/shared/Requests';
import { Animator } from './components/preview/Animator';
import { SharedCameraTransform } from './components/shared/SharedCameraTransform';

function App() {
    const [cameraTransforms] = useState(new SharedCameraTransform());
    const [animator] = useState(new Animator());
    const [models, setModels] = useState([]);
    const [title, setTitle] = useState('IGNC');

    const updateModels = async () => setModels(await Requests.getModels());
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
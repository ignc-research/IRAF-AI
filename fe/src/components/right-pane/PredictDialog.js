import React, { useContext, useEffect, useState } from "react";
import { AppSettings } from "../../AppSettings";
import { ToastHelper } from "../../ToastHelper";
import { ConfigHelper } from "../ConfigHelper";
import { MultiViewContext } from "../MultiViewContext";
import Dialog from "../shared/Dialog";
import LoadingOverlay from "../shared/LoadingOverlay";
import Requests from "../shared/Requests";
import { TabContext } from "../TabContext";
import DynamicField from "../shared/DynamicField/DynamicField";
import LogView from "./LogView";

export default function PredictDialog(props) {
    const tabContext = useContext(TabContext);
    const mvContext = useContext(MultiViewContext);

    const [log, setLog] = useState("");
    const [logDialogOpen, setLogDialogOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSave = async () => {
        try {
            setIsLoading(true);
            tabContext.setActivity("Predicting...");

            const groundTruth = Object.keys(tabContext.configs).find(x => tabContext.configs[x].type == 'GroundTruth');
            if (!groundTruth) {
                ToastHelper.error('There is no existing ground truth for the prediction!');
                return;
            }
            const startTime = Date.now();
            const model = {...selectedModel};

            const result = await Requests.predict(model, tabContext.weldingElement.obj, tabContext.configs[groundTruth].xml, tabContext.weldingElement.mtl);

            model.prediction_duration = Date.now() - startTime;

            const addResult = await ConfigHelper.addLayers(result, model, tabContext.welds, tabContext.configs);

            tabContext.setConfigs(addResult.layers);
            tabContext.setWelds(addResult.welds);

            setLog(result.log);
            setLogDialogOpen(true);
        }
        catch (e) {
            console.log(e)
            ToastHelper.error('Could not preprocess the config file');
        }
        finally {
            tabContext.setActivity("");
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    useEffect(() => {

        setSelectedModel(mvContext.models[0]);
        
    }, [mvContext.models]);

    useEffect(() => {
        setIsOpen(props.isOpen);
    }, [props.isOpen])


    return (
        <>
            <LoadingOverlay isOpen={isLoading}>
                <h1>Predicting</h1>
                {isLoading && selectedModel && <LogView type="Prediction" model={selectedModel} />}
            </LoadingOverlay>

            <Dialog className="modal-xl" isOpen={logDialogOpen} setIsOpen={setLogDialogOpen} title="Log" confirmText="Ok">
                <pre>
                {log}
                </pre>
            </Dialog>
            <Dialog isOpen={isOpen} setIsOpen={props.setIsOpen} title="Predict" callback={onSave} confirmText="Get prediction">
                <div className="mb-3">
                    <label className="form-label">Model</label>
                    <select className="form-select" value={selectedModel?.name} onChange={(ev) => setSelectedModel(mvContext.models.find(x => x.name == ev.target.value))}>
                        {mvContext.models.map(x => <option key={x.name} value={x.name}>{x.name}</option>)}
                    </select>
                </div>
                
                {
                selectedModel &&
                Object.keys(selectedModel.predict_parameters).map(x => 
                    <DynamicField key={x} model={selectedModel.predict_parameters[x]} /> 
                    )
                }
            </Dialog>
        </>
    );
}
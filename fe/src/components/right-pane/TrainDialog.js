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

export default function TrainDialog(props) {
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
            tabContext.setActivity("Training...");

            const result = await Requests.training(selectedModel);
            await mvContext.updateModels();
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
        if (!selectedModel && mvContext.models.length > 0) {
            setSelectedModel(mvContext.models[0]);
        }
    }, [mvContext.models]);

    useEffect(() => {
        setIsOpen(props.isOpen);
    }, [props.isOpen])

    return (
        <>
            <LoadingOverlay isOpen={isLoading}>
                <h1>Training</h1>
                {isLoading && selectedModel && <LogView type="Training" model={selectedModel} />}
            </LoadingOverlay>
            <Dialog className="modal-xl"  isOpen={logDialogOpen} setIsOpen={setLogDialogOpen} title="Log" confirmText="Ok">
                <pre>
                {log}
                </pre>
            </Dialog>
            <Dialog className="modal-lg" isOpen={isOpen} setIsOpen={props.setIsOpen} title="Train Model" callback={onSave} confirmText="Start Training">
                <div className="mb-3">
                    <label className="form-label">Model</label>
                    <select className="form-select" value={selectedModel?.name} onChange={(ev) => setSelectedModel(mvContext.models.find(x => x.name == ev.target.value))}>
                        {mvContext.models.map(x => <option key={x.name} value={x.name}>{x.name}</option>)}
                    </select>
                </div>
                <div className="d-flex flex-wrap">
                {
                selectedModel &&
                Object.keys(selectedModel.train_parameters).map(x => 
                    <DynamicField className="w-50" key={x} model={selectedModel.train_parameters[x]} /> 
                    )
                }
                </div>
            </Dialog>
        </>
    );
}
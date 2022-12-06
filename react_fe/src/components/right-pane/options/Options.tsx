import React, {useContext, useState} from 'react';
import AnimationSpeed from '../AnimationSpeed';
import LoopStatus from '../LoopStatus';
import ConfigEditor from '../ConfigEditor';
import { TabContext } from '../../TabContext';
import WeldListView from '../WeldView/WeldListView';
import './Options.css';
import FileSelector from '../../shared/FileSelector';
import { Icon } from '@iconify/react';
import { ConfigHelper } from '../../ConfigHelper';
import { ToastHelper } from '../../../ToastHelper';
import PredictDialog from '../PredictDialog';
import TrainDialog from '../TrainDialog';
import EvalDialog from '../EvalDialog';
import { SelectedFile } from '../../shared/FileSelector';
function Options (){
    const [showEvalDialog, setShowEvalDialog] = useState(false);
    const [showPredictDialog, setShowPredictDialog] = useState(false);
    const [showTrainDialog, setShowTrainDialog] = useState(false);
    const [paneExpanded, setPaneExpanded] = useState(true);
    const tabContext = useContext(TabContext);

    const addConfig = async (xml: SelectedFile) => {
        if (Object.keys(tabContext.layers).find(x => tabContext.layers[x].type == 'GroundTruth')) {
            ToastHelper.error("There is already an existing Ground Truth!");
            return;
        }

        const result = await ConfigHelper.addLayer(xml.file, 'Base', xml.name, 'GroundTruth', tabContext.welds, tabContext.layers );

        if (result) {
            tabContext.setWelds(result.welds);
            tabContext.setLayers(result.layers);
        }
    }

    const hasObjectConfig = Object.keys(tabContext.layers).length > 0 && tabContext.weldingElement.obj;

    return (
        <>
            { !paneExpanded &&
            <div className='options-pane-collapsed bg-primary'>
            </div>
            }
            {
                <div className='p-2 cursor-pointer h-100 bg-dark d-flex flex-column justify-content-center align-items-center border-start border-end border-secondary' onClick={() => setPaneExpanded(!paneExpanded)}>
                    <Icon className='fs-4' icon={paneExpanded ? "fa:angle-right" : "fa:angle-left"} />
                </div>
            }
            { 
            <div className={'options-pane d-flex bg-dark' + (paneExpanded ? '' : ' pane-collapsed')}>
                    <PredictDialog isOpen={showPredictDialog} setIsOpen={setShowPredictDialog} />
                    <TrainDialog isOpen={showTrainDialog} setIsOpen={setShowTrainDialog} />
                    {showEvalDialog && <EvalDialog isOpen={showEvalDialog} setIsOpen={setShowEvalDialog} />}
                    <div className="pose-view d-flex flex-column w-100">
                        <div className='bg-primary d-flex flex-wrap justify-content-around pb-2'>
                            <FileSelector className="mt-2 mx-1" accept=".obj" title="Select Welding Object" onChange={(evt) => tabContext.setWeldingElement({...tabContext.weldingElement, obj: evt[0]})}>
                                <Icon className='fs-3' icon="iconoir:3d-select-solid"></Icon>
                            </FileSelector>
                            <FileSelector className="mt-2 mx-1" accept=".mtl" title="Select Welding Material" onChange={(evt) => tabContext.setWeldingElement({...tabContext.weldingElement, mtl: evt[0]})}>
                                <Icon className='fs-3' icon="icon-park-outline:material-two"></Icon>
                            </FileSelector>
                            <FileSelector className="mt-2 mx-1" accept=".xml" title="Add config file" onChange={(evt) => addConfig(evt[0])}>
                                    <Icon className='fs-3' icon="bi:filetype-xml"></Icon>
                            </FileSelector>
                            <div title="Preprocessing" className={'btn btn-secondary mt-2 mx-1 ' + (hasObjectConfig ? '' : 'disabled') } onClick={() => setShowPredictDialog(true)}>
                                <Icon className='fs-3' icon="clarity:process-on-vm-line"></Icon>
                            </div>
                            <div title="Training" className={'btn btn-secondary mt-2 mx-1 ' + (hasObjectConfig ? '' : 'disabled') } onClick={() => setShowTrainDialog(true)}>
                                <Icon className='fs-3' icon="material-symbols:model-training"></Icon>
                            </div>
                            <div title="Evaluation" className={'btn btn-secondary mt-2 mx-1 ' + (hasObjectConfig ? '' : 'disabled') } onClick={() => setShowEvalDialog(true)}>
                                <Icon className='fs-3' icon="ant-design:area-chart-outlined"></Icon>
                            </div>
                        </div>
                        <div className='config-editor border-top border-bottom border-light p-2'>
                            <ConfigEditor />
                        </div>
                        {
                            Object.keys(tabContext.layers).length > 0 &&
                            (
                                <>
                                    <div className='px-2'>
                                        <AnimationSpeed  />
                                        <LoopStatus />    
                                    </div>
                                    <div className='flex-1 overflow-auto'>
                                        <WeldListView />
                                    </div>
                                </>
                            )
                        }

                    </div>            
            </div>
            }
        </>
    );

}
export default Options;
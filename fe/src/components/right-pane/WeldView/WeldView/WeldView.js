import React, {useContext, useState} from 'react';
import { Icon } from '@iconify/react';
import {TabContext} from '../../../TabContext';
import WeldPointView from './WeldPointView';

function WeldView (props){
    const [expanded, setExpanded] = useState(false);
    const tabContext = useContext(TabContext);
    const isCurrentWeld = tabContext.playingWeld?.name == props.weld.name;

    return (
        <div className={"m-2 bg-secondary border-top border-start border-end" + (isCurrentWeld ? " bg-light" : "")} key={props.weld.name}>
            <div className="d-flex user-select-none cursor-pointer justify-content-between align-items-center border-bottom">
                <div className='d-flex flex-1 justify-content-between align-items-center ps-1'>
                    <div title={props.weld.wkzName} className={isCurrentWeld ? "fw-bold p-1" : "fw-bold pe-1"}>{props.weld.wkzName[0]}</div>
                    <div className={isCurrentWeld ? "fw-bold p-1" : ""}>{props.weld.name}</div>
                    <div></div>
                </div>
                <div className='border-start p-2 d-flex align-items-center' onClick={() => setExpanded(!expanded)}>
                    {expanded ? (<Icon icon="bi:chevron-up" />) : (<Icon icon="bi:chevron-down" />)}
                </div>
            </div>
            <div className={"border-bottom"}>
                {expanded && props.weld.points.map((rep, idx2) => 
                <div className='d-flex justify-content-between align-items-center' key={idx2}>
                    <WeldPointView weld={props.weld} point={rep}  />
                    <Icon className='me-2' icon="akar-icons:info" onClick={() => props.openPoint(rep)} />
                </div>
                )}
            </div>
        </div>
    );

}
export default WeldView;
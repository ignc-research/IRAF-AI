import { Icon } from '@iconify/react';
import React, { useContext } from 'react';
import { WeldingSeam, WeldingSpot } from '../../../ConfigHelper';
import { TabContext } from '../../../TabContext';
import VectorRepresentationView from './VectorRepresentation';

export default function WeldPointView(props: { weld: WeldingSeam, point: WeldingSpot }) {
    // const color =  useContext(TabContext).configs[props.name]?.color ?? '#ff0000';
    const tabContext = useContext(TabContext);
    const isCurrentPoint = tabContext.playingWeld?.points[tabContext.selectedPoint.idx] === props.point;
    const setSelectedPoint = () => {
        tabContext.setPaused(true);
        tabContext.setPlayingWeld(props.weld);
        tabContext.setSelectedPoint({idx: props.weld.points.indexOf(props.point)});
    }
    return (
        <div className={'d-flex justify-content-between p-1 ' + (isCurrentPoint ? 'bg-primary' : '') }>
                <div>
                    <Icon className='me-1' icon="bi:play-circle-fill" onClick={setSelectedPoint} />
                </div>
                <VectorRepresentationView vector={props.point.position} />
        </div>
    )
}
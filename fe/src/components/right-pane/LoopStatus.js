import React, { useContext } from 'react';
import { TabContext } from '../TabContext';
import { Icon } from '@iconify/react';
function LoopStatus (props){
    const tabContext = useContext(TabContext);

    const stopPlaying = () => {
        tabContext.setPlayingWeld(null);
        tabContext.setPaused(true);
    }

    const togglePlayPause = () => {
        tabContext.setPaused(!tabContext.paused);
        if (!tabContext.playingWeld) {
            tabContext.setPlayingWeld(tabContext.welds[0]);
        }
    }

    const toggleLoopingWeld = () => tabContext.setIsLoopingWeld(!tabContext.isLoopingWeld);

    const isPlaying = () => tabContext.playingWeld;

    return (
        <div className='bg-secondary border my-2'>
            <div className='d-flex align-items-center border-bottom p-1'>
                <div className='btn btn-primary me-2' onClick={togglePlayPause}>
                    {tabContext.paused === false && <Icon icon="akar-icons:pause" />}
                    {tabContext.paused === true && <Icon icon="akar-icons:play" />}
                </div>
                <div className={'btn btn-primary me-2 ' + (isPlaying() ? '' : 'disabled')} onClick={stopPlaying}>
                    <Icon icon="carbon:stop-filled" />
                </div>
                <div className={'btn btn-primary me-2 ' + (tabContext.isLoopingWeld ? 'bg-success' : '')} onClick={toggleLoopingWeld}>
                    <Icon icon="ic:round-loop" />
                </div>
            </div>
            {isPlaying() && <span className='p-2 text-end'>Playing {tabContext.playingWeld.name}</span>}
            {!isPlaying() && <span className='p-2 text-end'>Nothing playing</span>}
        </div>
    );

}
export default LoopStatus;
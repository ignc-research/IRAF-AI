import React, { ChangeEvent, useContext } from 'react';
import { TabContext } from '../TabContext';

function AnimationSpeed (){
    const tabContext = useContext(TabContext);
    const updateSpeed = (event: ChangeEvent<HTMLInputElement>) => tabContext.setAnimationSpeed(+event.target.value);

    return (
        <div className="border bg-secondary p-1 mt-2">
            <label className="form-label">Animation speed</label>
            <input value={tabContext.animationSpeed ?? 0} min=".001" max="1" step=".001" type="range" className="form-range" id="customRange1" onChange={(e) => updateSpeed(e)} />
        </div>
    );

}
export default AnimationSpeed;
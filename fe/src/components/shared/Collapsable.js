import React, { useState} from 'react';
import { Icon } from '@iconify/react';
import './Collapsable.css';

function Collapsable (props){
    const isLeft = props.side === 'left';
    const [collapsed, setCollapsed] = useState(props.collapsed ? true : false);

    return (
        <div className={'d-flex' + (isLeft ? ' flex-row-reverse' : '')}>
            {
                <div className='p-2 cursor-pointer h-100 bg-dark d-flex flex-column justify-content-center align-items-center border-start border-end border-secondary' onClick={() => setCollapsed(!collapsed)}>
                    <div className='button'>
                        <Icon className='fs-4' icon={(!collapsed && !isLeft) || (collapsed && isLeft) ? "fa:angle-right" : "fa:angle-left"} />
                        <span className='title'>
                            <span className='title-inner'>
                            {props.title}
                            </span>
                        </span>
                        <Icon className='fs-4' icon={(!collapsed && !isLeft) || (collapsed && isLeft) ? "fa:angle-right" : "fa:angle-left"} />
                    </div>

                </div>
            }
            { 
                <div className={'pane bg-dark' + (!collapsed ? '' : ' pane-collapsed')}>
                    {props.children}      
                </div>
            }
        </div>
    );

}
export default Collapsable;
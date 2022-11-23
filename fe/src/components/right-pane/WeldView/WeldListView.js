import React, {useContext, useState} from 'react';
import { TabContext } from '../../TabContext';
import WeldInfoDialog from './WeldInfoDialog';
import WeldView from './WeldView/WeldView';

export default function WeldListView (props){
    const [dialogPoint, setDialogPoint] = useState(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const openDialog = (rep) => {
        setDialogPoint(rep);
        setIsDialogOpen(true);
    }

    const tabContext = useContext(TabContext); 

    let elems = tabContext.welds ?? [];

    return (
        <div className='h-100'>
            <WeldInfoDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} point={dialogPoint} ></WeldInfoDialog>
            {elems.map((el, idx) => (<WeldView  weld={el} key={idx} openPoint={openDialog} />))}
        </div>
    );

}
import React, {useContext, useState} from 'react';
import { WeldingSpot } from '../../ConfigHelper';
import Dialog from '../../shared/Dialog';
import { TabContext } from '../../TabContext';
import VectorRepresentationView from './WeldView/VectorRepresentation';

export default function WeldInfoDialog(props: { point?: WeldingSpot, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const tabContext = useContext(TabContext);
    return ((props.point && props.isOpen) ?
        <Dialog title="Weld Info" isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>WS Position</td>
                        <td><VectorRepresentationView vector={props.point?.position}/></td>
                    </tr>
                {
                    props.point.frames.map((x, idx) => 
                    <tr key={idx}>
                        <td>
                            <div>
                                <strong>
                                    {tabContext.layers[x.name].groupName} 
                                </strong>
                            </div>
                            <div>
                                {tabContext.layers[x.name].layerName}
                            </div>
                        </td>
                        <td>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Position:</td>
                                        <td><VectorRepresentationView vector={x.position} /></td>
                                    </tr>
                                    <tr>
                                        <td>XVek:</td>
                                        <td><VectorRepresentationView vector={x.rotation.xVec} /></td>
                                    </tr>
                                    <tr>
                                        <td>YVek:</td>
                                        <td><VectorRepresentationView vector={x.rotation.yVec} /></td>
                                    </tr>
                                    <tr>
                                        <td>ZVek:</td>
                                        <td><VectorRepresentationView vector={x.rotation.zVec} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>)
                }
                </tbody>
            </table>
            

        </Dialog>
        : <></>
    );
}
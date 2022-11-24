import React, { useEffect, useState } from "react";
import FileSelector from "../FileSelector";
import { Icon } from '@iconify/react';
export default function DynamicMultifile(props) {
    const model = props.model;
    const [state, setState] = useState([]);

    const onSelect = (files) => {
        setState(files);
    }

    const onRemoveFile = (file) => {
        const newFiles = [...state];
        newFiles.splice(newFiles.indexOf(file), 1);
        setState(newFiles);
    }

    useEffect(() => {
        props.onChange(fileToString(state));
    }, [state]);

    const fileToString = (files) => JSON.stringify(files);
    return (
        <div className="d-flex justify-content-between mb-3">
                <div className="w-100 px-3 overflow-auto">
                    <ul>
                        {state.map(x => 
                        <div key={x.name} className="d-flex justify-content-between">
                            <li className="flex-grow-1">{x.name}</li>
                            <Icon className="fs-5 ms-1 small-btn" icon="ant-design:close-circle-filled" onClick={() => onRemoveFile(x)} />
                        </div>
                        )}
                            
                    </ul>
                </div>
                <FileSelector accept={model?.accept} title="Select training files" multiple={true} onChange={onSelect}>
                    <Icon className='fs-3' icon="bi:filetype-xml"></Icon>
                </FileSelector>
        </div>
    );
}
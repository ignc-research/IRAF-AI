import React, { useState } from "react";

export default function DynamicSelect(props) {
    const model = props.model;
     
    return (
        <div className="mb-3">
                <select className="form-select" value={model.value} onChange={(ev) => props.onChange(ev.target.value)}>
                    {Object.keys(model.options).map(x => 
                        <option key={x} value={x}>{model.options[x].display}</option>
                    )}
                </select>
        </div>
    );
}
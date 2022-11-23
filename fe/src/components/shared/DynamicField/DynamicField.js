import React, { useState, useEffect } from "react";
import DynamicMultifile from "./DynamicMultifile";
import DynamicSelect from "./DynamicSelect";

export default function DynamicField(props) {
    const model = props.model;
    const [value, setValue] = useState(model.value ?? '');
    const onChange = (value) => {
        model.value = value;
        setValue(value);
    };

    const isMultiFile  = () => model.type == 'multifile';
    const isSelect = () => model.type == 'select';
    const hasParams = () => isSelect() && Object.keys(model.options[value]?.parameters ?? {}).length > 0;

    useEffect(() => {
        const value = (!model.options || model.options[model.value]) ? model.value : Object.keys(model.options ?? {})[0] ?? "";
        setValue(value);
        onChange(value);
    }, [model]);

    return (
        <div className={"mb-3 ps-3 " + props.className}>
            <label className="form-label">{model.display}</label>
            {!isSelect() && !isMultiFile() && <input type={model.type} className="form-control" value={value} onChange={(ev) => onChange(ev.target.value)} />}
            {isSelect() && !isMultiFile() && <DynamicSelect onChange={onChange} model={model} />}
            {isMultiFile() &&!isSelect() && <DynamicMultifile model={model} onChange={onChange} />}


            <div className="d-flex flex-wrap">
            {
                hasParams() &&
                Object.keys(model.options[value].parameters).map(x => <DynamicField className="w-50" key={x} model={model.options[value].parameters[x]} />)
            }
            </div>
        </div>
    );
}
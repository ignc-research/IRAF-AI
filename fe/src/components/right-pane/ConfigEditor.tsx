import { Icon } from "@iconify/react";
import React, { ChangeEvent, useContext } from "react";
import { ConfigHelper, Layer } from "../ConfigHelper";
import { TabContext } from "../TabContext";

function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

export default function ConfigEditor() {
    const tabContext = useContext(TabContext);
    
    let timer: NodeJS.Timeout | null = null;
    const onColorChange = (layer: string, ev: ChangeEvent<HTMLInputElement>) => {
        if (timer) {
            clearTimeout(timer);
        }
        const color = ev.target.value;
        timer = setTimeout(() => {
            const layers = {...tabContext.layers };
            layers[layer].color = color;
            tabContext.setLayers(layers);
        }, 500);
    }

    const removeConfig = (name: string) => {
        const result = ConfigHelper.removeConfig(name, tabContext.welds, tabContext.layers);
        tabContext.setLayers(result.configs);
        tabContext.setWelds(result.welds);
        if (result.welds.length == 0) {
            tabContext.setPaused(true);
            tabContext.setPlayingWeld(null);
        }
    }

    const toggleConfigVisibility = (name: string) => {
        const newConfig = {...tabContext.layers};
        newConfig[name]['hidden'] = !newConfig[name].hidden;
        tabContext.setLayers(newConfig);
    };

    const types = Array.from(new Set(Object.keys(tabContext.layers).map(x => tabContext.layers[x].type)));
    const getConfigsOfType = (type: string) => Object.keys(tabContext.layers).filter(x => tabContext.layers[x].type === type);
    const getGroupsOfType = (type: string) => Array.from(new Set(Object.keys(tabContext.layers).filter(x => tabContext.layers[x].type === type).map(x => tabContext.layers[x].groupName)));
    const getLayersOfGroup = (group: string) => Object.keys(tabContext.layers).filter(x => tabContext.layers[x].groupName === group);
    return (
        <div className="bg-secondary border p-1">
            {Object.keys(tabContext.layers).length == 0 && <div>No configs loaded</div>}
            {types.map(type => (
                <div className="p-1 mb-1 border-bottom" key={type}>
                    <h5>{type}</h5>
                    {
                        getGroupsOfType(type).map(group => (
                            <div className="ms-3" key={group}>
                                <h6 className="border-bottom border-dark">{group}</h6>
                                {getLayersOfGroup(group).map((configName) => (
                                    <div key={configName} className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex mb-1 align-items-center">
                                            <input type="color" className="small-btn" value={tabContext.layers[configName].color} onChange={(e) => onColorChange(configName, e)} />
                                            {tabContext.layers[configName].hidden && <Icon className="fs-4 mx-1 small-btn" icon="gridicons:not-visible" onClick={() => toggleConfigVisibility(configName)} />}
                                            {!tabContext.layers[configName].hidden && <Icon className="fs-4 mx-1 small-btn" icon="gridicons:visible" onClick={() => toggleConfigVisibility(configName)} />}
                                        </div>
                                        <span className="pe-1 config-name">{tabContext.layers[configName].layerName}</span>
                                        <div className="d-flex">
                                            <Icon className="fs-5 ms-1 small-btn" icon="akar-icons:cloud-download" onClick={() => download(tabContext.layers[configName].xml.name, tabContext.layers[configName].xml.file)} />
                                            <Icon className="fs-5 ms-1 small-btn" icon="ant-design:close-circle-filled" onClick={() => removeConfig(configName)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    }

                </div>
            ))}
        </div>
    );
}
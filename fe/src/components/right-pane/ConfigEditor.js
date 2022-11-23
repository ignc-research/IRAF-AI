import { Icon } from "@iconify/react";
import React, { useContext } from "react";
import { ConfigHelper } from "../ConfigHelper";
import { TabContext } from "../TabContext";

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

export default function ConfigEditor(props) {
    const tabContext = useContext(TabContext);
    
    let timer = null;
    const onColorChange = (config, ev) => {
        if (timer) {
            clearTimeout(timer);
        }
        const color = ev.target.value;
        timer = setTimeout(() => {
            const configs = {...tabContext.configs };
            configs[config].color = color;
            tabContext.setConfigs(configs);
        }, 500);
    }

    const removeConfig = (name) => {
        const result = ConfigHelper.removeConfig(name, tabContext.welds, tabContext.configs);
        tabContext.setConfigs(result.configs);
        tabContext.setWelds(result.welds);
        if (result.welds.length == 0) {
            tabContext.setPaused(true);
            tabContext.setPlayingWeld(null);
        }
    }

    const toggleConfigVisibility = (name) => {
        const newConfig = {...tabContext.configs};
        newConfig[name]['hidden'] = !newConfig[name].hidden;
        tabContext.setConfigs(newConfig);
    };

    const types = Array.from(new Set(Object.keys(tabContext.configs).map(x => tabContext.configs[x].type)));
    const getConfigsOfType = (type) => Object.keys(tabContext.configs).filter(x => tabContext.configs[x].type === type);
    const getGroupsOfType = (type) => Array.from(new Set(Object.keys(tabContext.configs).filter(x => tabContext.configs[x].type === type).map(x => tabContext.configs[x].groupName)));
    const getLayersOfGroup = (group) => Object.keys(tabContext.configs).filter(x => tabContext.configs[x].groupName === group);
    return (
        <div className="bg-secondary border p-1">
            {Object.keys(tabContext.configs).length == 0 && <div>No configs loaded</div>}
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
                                            <input type="color" className="small-btn" value={tabContext.configs[configName].color} onChange={(e) => onColorChange(configName, e)} />
                                            {tabContext.configs[configName].hidden && <Icon className="fs-4 mx-1 small-btn" icon="gridicons:not-visible" onClick={() => toggleConfigVisibility(configName)} />}
                                            {!tabContext.configs[configName].hidden && <Icon className="fs-4 mx-1 small-btn" icon="gridicons:visible" onClick={() => toggleConfigVisibility(configName)} />}
                                        </div>
                                        <span className="pe-1 config-name">{tabContext.configs[configName].layerName}</span>
                                        <div className="d-flex">
                                            <Icon className="fs-5 ms-1 small-btn" icon="akar-icons:cloud-download" onClick={() => download(tabContext.configs[configName].xml.name, tabContext.configs[configName].xml.file)} />
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
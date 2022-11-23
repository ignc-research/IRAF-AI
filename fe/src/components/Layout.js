import * as React from "react";
import { createRoot } from "react-dom/client";
import * as FlexLayout from "flexlayout-react";
import AppTab from "./AppTab";
import { Icon } from '@iconify/react';
import { Actions } from "flexlayout-react";
export default class Layout extends React.Component {
    json = {
        global: {
            // "tabEnableFloat": true,
            "tabSetMinWidth": 100,
            "tabSetMinHeight": 100,
            "borderMinSize": 100
        },
        borders: [],
        layout: {
            type: "row",
            weight: 100,
            children: [
                {
                    type: "tabset",
                    weight: 100,
                    enableDeleteWhenEmpty: false,
                    children: [
                        {
                            type: "tab",
                            name: "empty",
                            component: "appTab",
                        }
                    ]
                }
            ]
        }
    };

    layoutRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {model: FlexLayout.Model.fromJson(this.json)};
    }

    factory = (node) => {
        var component = node.getComponent();
        if (component === "button") {
            return <button>{node.getName()}</button>;
        }
        if (component === "appTab") {
            // Eig nicht richtig
            const renameTab = (name) => {
                this.state.model.doAction(Actions.renameTab(node.getId(), name));
            };
            return <AppTab updateTitle={(x) => renameTab(x)}></AppTab>;
        }
    }

    onRenderTab = (node, renderValues) => {
        
        //renderValues.content = node.getExtraData().name ?? 'Unknown';
    }

    onAddFromTabSetButton = (node) => {
        this.layoutRef.current.addTabToTabSet(node.getId(), {
            component: "appTab"
        });
    }

    onRenderTabSet = (node, renderValues) => {
        renderValues.stickyButtons.push(
            <Icon icon="akar-icons:plus"
                key="Add button"
                title="Add Tab (using onRenderTabSet callback, see Demo)"
                style={{ width: "1.1em", height: "1.1em", color: 'white', cursor: 'pointer' }}
                className="flexlayout__tab_toolbar_button"
                onClick={() => this.onAddFromTabSetButton(node)}
            />);
    }

    render() {
        return (
            <FlexLayout.Layout ref={this.layoutRef} onRenderTab={this.onRenderTab} onRenderTabSet={this.onRenderTabSet} model={this.state.model} factory={this.factory}/>
        )
    }
}
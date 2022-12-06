import * as React from "react";
import { createRoot } from "react-dom/client";
import * as FlexLayout from "flexlayout-react";
import AppTab from "./AppTab";
import { Icon } from '@iconify/react';
import { Actions } from "flexlayout-react";
export default class Layout extends React.Component<{className?: string, children: any}> {
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

    layoutRef = React.createRef<FlexLayout.Layout>();

    constructor(props: any) {
        super(props);
        this.state = {model: FlexLayout.Model.fromJson(this.json as any)};
    }

    factory = (node: FlexLayout.TabNode) => {
        var component = node.getComponent();
        if (component === "button") {
            return <button>{node.getName()}</button>;
        }
        if (component === "appTab") {
            // Eig nicht richtig
            const renameTab = (name: string) => {
                (this.state as any).model.doAction(Actions.renameTab(node.getId(), name));
            };
            return <AppTab updateTitle={(x) => renameTab(x)}></AppTab>;
        }
    }


    onAddFromTabSetButton = (node: FlexLayout.TabSetNode | FlexLayout.BorderNode) => {
        (this.layoutRef as any).current.addTabToTabSet(node.getId(), {
            component: "appTab"
        });
    }

    onRenderTabSet = (node: FlexLayout.TabSetNode | FlexLayout.BorderNode, renderValues: any) => {
        renderValues.stickyButtons.push(
            <Icon icon="akar-icons:plus"
                key="Add button"
                style={{ width: "1.1em", height: "1.1em", color: 'white', cursor: 'pointer' }}
                className="flexlayout__tab_toolbar_button"
                onClick={() => this.onAddFromTabSetButton(node)}
            />);
    }

    render() {
        return (
            <FlexLayout.Layout ref={this.layoutRef} onRenderTabSet={this.onRenderTabSet} model={(this.state as any).model} factory={this.factory}/>
        )
    }
}
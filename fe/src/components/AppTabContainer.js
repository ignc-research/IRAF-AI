import AppTab from "./AppTab";
import React, { useEffect, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav';
import { Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

function AppTabContainer(props) {


    const [state, setState] = useState({ tabs: [{ title: "" }] });
    const [key, setKey] = useState(0);

    const updateTitle = (tab, title) => {
        const tabIndex = state.tabs.indexOf(tab);
        const newTab = {...tab, title: title };
        state.tabs[tabIndex] = newTab;
        setState({...state, tabs: state.tabs });
    };

    const addTab = () => {
        state.tabs.push({ title: "" });
        setState({...state, tabs: [...state.tabs]});
    };

    const removeTab = (tab) => {
        const tabIndex = state.tabs.indexOf(tab);
        state.tabs.splice(tabIndex, 1);
        setState({...state, tabs: [...state.tabs]});
    };

    useEffect(() => {
        setKey(state.tabs.length - 1);
    }, [state.tabs.length]);

    return (
        <div className={"d-flex flex-column " + props.className}>
            <Tab.Container defaultActiveKey="first"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                >
                <div className="ms-2 mt-2 d-flex justify-content-between">
                    <Nav variant="tabs">
                        {
                            state.tabs.map((tab, idx) => (
                                <Nav.Item key={idx}>
                                    <Nav.Link eventKey={idx}>{tab.title} <Icon className={state.tabs.length > 1 ? "" : "invisible"} onClick={() => removeTab(tab)} icon="clarity:remove-line" /></Nav.Link>
                                </Nav.Item>
                            ))
                        }
                        <Button variant='clear' onClick={() => addTab()}>+</Button>
                    </Nav>

                </div>
                <Tab.Content className="flex-1">
                    {
                        state.tabs.map((tab, idx) => (
                            <Tab.Pane key={idx} eventKey={idx}>
                                <AppTab updateTitle={(title) => updateTitle(tab, title)} />
                            </Tab.Pane>
                        ))
                    }
                </Tab.Content>
            </Tab.Container>
        </div>

    );
}

export default AppTabContainer;
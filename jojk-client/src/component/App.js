import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Sidebar from 'react-sidebar';

import MyNowPlaying from './MyNowPlaying';
import Menu from './Menu';
import Profile from './Profile';

import './../styles/App.css';

const mql = window.matchMedia(`(min-width: 800px)`);

class App extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            mql: mql,
            docked: props.docked,
            open: props.open
        }

        this.sidebarStyle = {
            sidebar: {
              overflowY: 'auto',
            },
            content: {
              overflowY: 'auto'
            }
        };

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
    }
    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({mql: mql, sidebarDocked: mql.matches});
    }
    componentWillUnmount() {
        this.setState({sidebarDocked: this.state.mql.matches});
    }
    mediaQueryChanged() {
        this.setState({sidebarDocked: this.state.mql.matches});
    }
    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }
    closeSidebar() {
        this.setState({sidebarOpen: false});
    }

    render() {
        return (
            <div className="App">
                <Sidebar sidebar={<Menu closeSidebar={this.closeSidebar} />}
                    children={(
                        <div>
                            <Route exact={true} path="/" component={Profile} />
                            <Route path="/profile" component={Profile} />
                        </div>
                        )}
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.onSetSidebarOpen}
                    rootClassName="Sidebar"
                    sidebarClassName="Sidebar-drawer"
                    contentClassName="Content"
                    styles={this.sidebarStyle} />
                
                <MyNowPlaying />
            </div>
        );
    }
}


export default App;

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import axios from 'axios';
import config from './../../config.json';

import MyNowPlaying from './MyNowPlaying';
import Menu from './Menu';
import Billboard from './Billboard';

import './../styles/App.css';

const mql = window.matchMedia(`(min-width: 800px)`);

class App extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            mql: mql,
            docked: props.docked,
            open: props.open,
            location: undefined
        }

        this.sidebarStyle = {
            sidebar: {
              overflowY: 'auto',
            },
            content: {
              overflowY: 'auto'
            }
        };

        this.mapsApi = axios.create({
            baseURL: config.maps.baseURL,
            timeout: 1000
        });

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
    }
    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({mql: mql, sidebarDocked: mql.matches});
        this.getLocation();
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
    
    getLocation() {
        var _this = this;
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(pos) {
                _this.mapsApi.get('json?latlng='+pos.coords.latitude+','+pos.coords.longitude+'&location_type=APPROXIMATE&result_type=locality&key='+config.firebase.apiKey)
                .then(res => {
                    var location = res.data.results[0].address_components;
                    location = {
                        city: location[0].long_name,
                        country: location[3].long_name,
                        country_code: location[3].short_name
                    }
                    //localStorage.setItem('location', JSON.stringify(location));
                    _this.setState({location:location});
                });
            }, function(error) {
                console.log(error);
                if (error.code === 1) {
                    //User denied Geolocation
                    //TODO: show some popup with info
                }
            });
        } else {
            /* geolocation IS NOT available */
            console.log('no location available');
        }
    }

    render() {
        return (
            <div className="App">
                <Sidebar sidebar={<Menu closeSidebar={this.closeSidebar} />}
                    children={(
                        <div>
                            <Route exact={true} path="/" render={(props) =>
                                <Billboard userLocation={this.state.location}/>
                            } />
                            <Route path="/:country/:city" component={Billboard} />
                        </div>
                        )}
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.onSetSidebarOpen}
                    rootClassName="Sidebar"
                    sidebarClassName="Sidebar-drawer"
                    contentClassName="Content"
                    styles={this.sidebarStyle} />
                
                <MyNowPlaying location={this.state.location}/>
            </div>
        );
    }
}


export default App;

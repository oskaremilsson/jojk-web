import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import axios from 'axios';
import config from './../../config.json';

import MyNowPlaying from './MyNowPlaying';
import Menu from './Menu';
import Billboard from './Billboard';

import MenuIcon from 'mdi-react/MenuIcon';

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
        this.toggleSidebar = this.toggleSidebar.bind(this);
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

    toggleSidebar() {
        if (this.state.sidebarOpen) {
            this.setState({sidebarOpen: false});
        } else {
            this.setState({sidebarOpen: true});
        }
    }

    getRegion(lat,long) {
        let _this = this;
        this.mapsApi.get('json?latlng='+lat+','+long+'&language=en&key='+config.firebase.apiKey)
        .then(res => {
            let components;
            let country, city;

            for (let i = 0; i < res.data.results.length; i++) {
                components = res.data.results[i].address_components;
                components.forEach(component => {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    } else if (component.types.includes('administrative_area_level_2')) {
                        city = component.long_name.replace(' Municipality','');
                    } else if (component.types.includes('country')) {
                        country = component;
                    }
                });
            }

            if (city) {
                let location = {
                    city: city.long_name,
                    country: country.long_name,
                    country_code: country.short_name
                }
                _this.setState({location:location});
            }
            
        });
    }
    
    getLocation() {
        var _this = this;
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(pos) {
                //_this.mapsApi.get('json?latlng='+pos.coords.latitude+','+pos.coords.longitude+'&location_type=APPROXIMATE&result_type=locality&language=en&key='+config.firebase.apiKey)
                _this.getRegion(pos.coords.latitude, pos.coords.longitude);
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
                            <MenuIcon onClick={this.toggleSidebar} className="Menu-icon" />
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

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import axios from 'axios';
import config from './../../config.json';

import MyNowPlaying from './MyNowPlaying';
import Menu from './Menu';
import Billboard from './Billboard';
import ArtistInfo from './ArtistInfo';
import AlbumInfo from './AlbumInfo';
import PlaylistInfo from './PlaylistInfo';
import ProfileInfo from './ProfileInfo';
import Popup from './Popup';

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
            location: undefined,
            showPopup: false,
            popupTitle: undefined,
            popupText: undefined,
            popupType: undefined,
            popupButtonText: undefined,
            token: this.props.token
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
            baseURL: config.maps.baseURL
        });
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.setToken = this.setToken.bind(this);
    }
    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({mql: mql, sidebarDocked: mql.matches});
        this.getLocation();
    }

    componentWillUnmount() {
        this.setState({sidebarDocked: this.state.mql.matches});
    }

    setToken(token) {
        this.setState({token: token});
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
            let country, city;

            res.data.results.some(result => {
                result.address_components.some(component => {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    } else if (!city && component.types.includes('administrative_area_level_2')) {
                        city = component.long_name.replace(/ Municipality.*/, '');
                    } else if (component.types.includes('country')) {
                        country = component;
                    }
                    if (city && country) {
                        //no more iterations needed
                        return true;
                    }
                    return false;
                });
                if (city && country) {
                    //no more iterations needed
                    return true;
                }
                return false;
            })

            if (city) {
                let location = {
                    city: city,
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
                _this.getRegion(pos.coords.latitude, pos.coords.longitude);
            }, function(error) {
                console.log(error);
                if (error.code === 1) {
                    //User denied Geolocation
                    _this.setState({
                        popupTitle: 'Location permission',
                        popupText: 'To share your tracks, please allow Location',
                        popupType: 'Info',
                        popupButtonText: 'Ok, got it'
                    })
                } else if (error.code === 2) {
                    /* geolocation IS NOT available */
                    console.log('no location available');
                }
            });
        } else {
            /* geolocation IS NOT available */
            console.log('no location available');
        }
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        return (
            <div className="App">
                {this.state.showPopup ? 
                    <Popup
                        title={this.state.popupTitle}
                        text={this.state.popupText}
                        type={this.state.popupType}
                        buttonText={this.state.popupButtonText}
                        closePopup={this.togglePopup}
                    />
                    : null
                }
                <Sidebar sidebar={<Menu closeSidebar={this.closeSidebar} />}
                    children={(
                        <div>
                            <MenuIcon onClick={this.toggleSidebar} className="Menu-icon" />
                            <Switch>
                                <Route path="/region/:country/:city" render={(props) =>
                                    <Billboard token={this.state.token} match={props.match}/>
                                } />
                                <Route path="/artist/:id" render={(props) =>
                                    <ArtistInfo token={this.state.token} match={props.match} location={this.state.location}/>
                                } />
                                <Route path="/album/:id" render={(props) =>
                                    <AlbumInfo token={this.state.token} match={props.match} location={this.state.location}/>
                                } />
                                <Route path="/playlist/:user/:id" render={(props) =>
                                    <PlaylistInfo token={this.state.token} match={props.match} location={this.state.location}/>
                                } />
                                <Route path="/profile/:user" render={(props) =>
                                    <ProfileInfo token={this.state.token} match={props.match}/>
                                } />
                                <Route exact={true} path="/profile" render={(props) =>
                                    <ProfileInfo token={this.state.token} user={this.props.user}/>
                                } />
                                <Route path="/" render={(props) =>
                                    <Billboard token={this.state.token} userLocation={this.state.location} refreshLocation={this.getLocation}/>
                                } />
                            </Switch>
                        </div>
                        )}
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.onSetSidebarOpen}
                    rootClassName="Sidebar"
                    sidebarClassName="Sidebar-drawer"
                    contentClassName="Content"
                    styles={this.sidebarStyle} />
                
                <MyNowPlaying token={this.state.token} setToken={this.setToken} location={this.state.location}/>
            </div>
        );
    }
}


export default App;

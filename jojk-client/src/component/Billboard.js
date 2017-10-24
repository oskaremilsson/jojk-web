import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';
import './../styles/Billboard.css';

import BillboardListItem from './BillboardListItem';
import Loading from './Loading';
import LocationIcon from 'mdi-react/MapMarkerIcon';

class Billboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listening: false,
            jojks: [],
            jojksRef: undefined,
            city: 'Unknown',
            loaded: false
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }
    }

    getLocation() {
        var location = {};
        if (this.props.match) {
            location.city = this.props.match.params.city;
            location.country = this.props.match.params.country;
        } else if (this.props.userLocation) {
            location.city = this.props.userLocation.city;
            location.country = this.props.userLocation.country;
        }
        return location;
    }

    componentDidUpdate() {
        let location = this.getLocation();
        if (location.city) {
            if (this.state.city !== location.city) {
                if(this.state.jojksRef) {
                    this.state.jojksRef.off();
                    this.setState({
                        listening: false,
                        loaded: false,
                        jojks: []
                        });
                }
                this.listenForJojks(location);
            }
        } else {
            if (this.state.city !== 'Unknown') {
                this.setState({
                    city: 'Unknown',
                    listening: false,
                    loaded: true,
                    jojks: []
                });
            }
        }
    }
    componentWillMount() {
        var location = this.getLocation();
        this.listenForJojks(location);
    }

    listenForJojks(location) {
        var _this = this;
        if (location.city && !this.state.listening) {
             var jojksRef = firebase.database().ref('jojks/' + location.country + '/' + location.city).orderByChild('when').limitToLast(50);

             this.setState(
                 {
                    listening: true,
                    jojksRef: jojksRef,
                    city: location.city
                });

            jojksRef.on('child_added', function(data) {
                _this.setState({jojks: [...[{key: data.key,jojk:data.val()}], ..._this.state.jojks]});
             });

             let checkRef = firebase.database().ref('jojks/' + location.country + '/' + location.city).limitToLast(1);
             checkRef.once('value').then(data => {
                 if (!data.val()) {
                    _this.setState({loaded: true});
                 }
             });
        }
    }

    componentWillUnmount() {
        if(this.state.jojksRef) {
            this.state.jojksRef.off();
            this.setState({listening: false});
        }
    }

    render() {
        return(
            <div className="Billboard">
                <h1>{
                        this.props.userLocation ? 
                            this.props.userLocation.city === this.state.city ? 
                                <span onClick={this.props.refreshLocation}><LocationIcon className="Icon"/></span>
                            : null
                        : null
                    }
                    {
                        this.state.city === 'Unknown'?
                            <span onClick={this.props.refreshLocation}><LocationIcon className="Icon"/></span>
                        : null
                    }
                    {this.state.city} 
                </h1>
                { this.state.jojks.length < 1 && !this.state.loaded && this.state.city !== 'Unknown'?
                    <Loading text="Loading tracks"/>
                    :null
                }
                { !this.props.noLocation && this.state.city === 'Unknown'?
                    <Loading text="Checking location"/>
                    :null
                }
                <ul>
                    {
                        this.state.city === 'Unknown' && this.props.noLocation ?
                        <div>Couldn't get your position :(</div>
                        : null
                    }
                    { this.state.jojks.length < 1 && this.state.loaded && this.state.city !== 'Unknown' ?
                        <div>Nothing to show, listen to a track to share it with your region.</div>
                        :
                        this.state.jojks.map((item) => (
                            <BillboardListItem key={item.key} jojk={item.jojk} token={this.props.token} />
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default Billboard;
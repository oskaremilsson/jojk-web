import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';
import './../styles/Billboard.css';

import BillboardListItem from './BillboardListItem';
import LocationIcon from 'mdi-react/MapMarkerIcon';

class Billboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listening: false,
            jojks: [],
            jojksRef: undefined,
            city: 'Unknown'
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
        if (this.state.city !== location.city) {
            if(this.state.jojksRef) {
                this.state.jojksRef.off();
                this.setState({
                    listening: false,
                    jojks: []
                    });
            }
            this.listenForJojks(location);
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
                    {this.state.city} 
                </h1>
                <ul>
                    {
                        this.state.jojks.map((item) => (
                            <BillboardListItem key={item.key} jojk={item.jojk} />
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default Billboard;
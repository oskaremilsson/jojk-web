import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import * as firebase from "firebase";
import config from './../../config.json';
import './../styles/Billboard.css';

import BillboardListItem from './BillboardListItem';

class Billboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listening: false,
            jojks: [],
            jojksRef: undefined,
            city: 'Loading location'
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
        var location = this.getLocation();

        if (this.state.city !== location.city) {
            if(this.state.jojksRef) {
                this.state.jojksRef.off();
                this.setState({listening: false});
                this.setState({jojks: []});
            }
        }
        this.listenForJojks(location);
    }
    componentWillMount() {
        var location = this.getLocation();
        this.listenForJojks(location);
    }

    listenForJojks(location) {
        var _this = this;
        if (location.city && !this.state.listening) {
             this.setState({listening: true});
 
             var jojksRef = firebase.database().ref('jojks/' + location.country + '/' + location.city).orderByChild('when').limitToLast(50);
             this.setState({jojksRef: jojksRef});
             this.setState({city: location.city});

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
                <h1>{this.state.city}</h1>
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
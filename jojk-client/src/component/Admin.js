import React, { Component } from 'react';
import config from './../../config.json';
import * as firebase from "firebase";

//import './../styles/Admin.css';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state= {
            status: undefined,
            authed: false
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

        this.calculateJojkNumbers = this.calculateJojkNumbers.bind(this);
    }
    componentDidMount() {
        let _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                if (user.uid === 'oskaremilsson') {
                    _this.setState({authed : true});
                } else {
                    _this.props.history.replace('/');
                }
            }
        });
    }

    calculateJojkNumbers() {
        let _this = this;
        const jojksRef = firebase.database().ref('jojks');
        const usersRef = firebase.database().ref('users');
        this.setState({status: 'Connectiong to firebase'});
        Promise.all([usersRef.once('value'), jojksRef.once('value')]).then(data => {
            _this.setState({status: 'Data fetched, calculating'});

            let users = data[0];
            let nrOfUsers = Object.keys(users.val()).length;

            let jojks = data[1];
            let nrOfRegions = 0, nrOfTracks = 0;

            Object.keys(jojks.val()).forEach(country => {
                nrOfRegions += Object.keys(jojks.val()[country]).length;
                Object.keys(jojks.val()[country]).forEach(region => {
                    nrOfTracks += Object.keys(jojks.val()[country][region]).length;
                });
            });

            _this.setState({status: 'Saving to firebase'});
            let numbers= {
                'regions' : nrOfRegions, 
                'tracks': nrOfTracks,
                'users': nrOfUsers,
                'when': Date.now()
            };

            const statsRef = firebase.database().ref('stats');

            statsRef.child('counts').set(numbers);
            _this.setState({status: 'Done'});
        });
    }

    render() {
        if (this.state.authed) {
        return (
            <div className="Admin">
                You are admin!
                <div>{this.state.status}</div>
                <div onClick={this.calculateJojkNumbers}>Update database numbers</div>
            </div>
        );
        } else {
            return null;
        }
    }
}


export default Admin;

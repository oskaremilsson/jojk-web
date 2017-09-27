import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import * as firebase from "firebase";
import config from './../../config.json';


//import './../styles/Billboard.css';

class Billboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listening: false,
            jojks: [],
            jojksRef: undefined
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }
    }

    componentDidUpdate() {       
        this.listenForJojks();
    }
    componentWillMount() {
        this.listenForJojks();
    }

    listenForJojks() {
        var _this = this;
        if (this.props.location && !this.state.listening) {
             this.setState({listening: true});
 
             var jojksRef = firebase.database().ref('jojks/' + this.props.location.country + '/' + this.props.location.city);
             this.setState({jojksRef: jojksRef});
 
             jojksRef.on('child_added', function(data) {
                 _this.setState({jojks: _this.state.jojks.concat([{key: data.key,track:data.val()}])});
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
            <div className="Profile">
                {
                    this.state.jojks.map((item) => (
                        <div key={item.key}>{item.track.name}</div>
                    ))
                }
            </div>
        );
    }
}

export default Billboard;
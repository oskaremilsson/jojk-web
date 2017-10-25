import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';

import './../styles/NewJojkHighlight.css';
import Icon from 'mdi-react/MusicIcon';

class NewJojkHighlight extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            newJojk: false,
            timeout: undefined
        };

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

        this.turnOff = this.turnOff.bind(this);
    }

    turnOff() {
        this.setState({newJojk:false});
    }

    componentDidMount() {
        let _this = this;
        const ref = firebase.database().ref('jojks/' + this.props.country + '/' + this.props.city).orderByChild('when').limitToLast(1);
        ref.once('value').then(data => {
            _this.setState({loaded:true});
        });
        ref.on('child_added', function(data) {
            if(_this.state.loaded) {
                if (_this.state.timeout) {
                    clearTimeout(_this.state.timeout);
                }

                _this.setState({
                    newJojk:true,
                    timeout: setTimeout(_this.turnOff, 10000)
                });
                
            }
        });
    }
    render() {
        return (
            <div className={'NewJojkHighlight' + (this.state.newJojk ? ' Active' : '')}>
                <Icon className="Icon"/>
            </div>
        );
    }
}

export default NewJojkHighlight;

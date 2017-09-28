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
 
             var jojksRef = firebase.database().ref('jojks/' + this.props.location.country + '/' + this.props.location.city).orderByChild('when');
             this.setState({jojksRef: jojksRef});
 
             jojksRef.on('child_added', function(data) {
                 _this.setState({jojks: [{key: data.key,jojk:data.val()}].concat(_this.state.jojks)});  
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
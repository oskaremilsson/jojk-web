import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';

class Login extends Component {
    componentWillMount() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

        var _this = this;
        firebase.auth().signOut().then(function() {
            localStorage.clear();
            _this.props.loggedOut();
          }).catch(function(error) {
            localStorage.clear();
            _this.props.loggedOut();
          });
        
    }
    render() {
        return (
            <div className="Logout">
            </div>
        );
  }
}


export default Login;

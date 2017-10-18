import React, { Component } from 'react';
import * as firebase from "firebase";
import axios from 'axios';
import config from './../../config.json';

class CheckLoginStatus extends Component {
  constructor(props) {
    super(props);

    if (firebase.apps.length === 0) {
        firebase.initializeApp(config.firebase);
    }
  }

  componentWillMount() {
    var _this = this;
    var token = localStorage.getItem('refresh_token');
    if (!token) {
        this.props.authError();
    } else {
        axios.get(config.auth.URL +'?refresh=' + token)
        .then(res => {
            localStorage.setItem('access_expires', Date.now() + res.data.expires_in*1000);
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    _this.props.authSuccess(user, res.data.access_token);
                } else {
                    _this.props.authError();
                }
            });
        })
        .catch(err => {
            console.log(err);
            _this.props.authError();
        });
    }
  }

  render() {
      return (
          <div>            
          </div>
      );
  }
}


export default CheckLoginStatus;

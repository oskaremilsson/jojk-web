import React, { Component } from 'react';
import * as firebase from "firebase";
import axios from 'axios';
import config from './../../config.json';

class CheckLoginStatus extends Component {
  constructor(props) {
    super(props);

    this.token = localStorage.getItem('access_token');
    this.spotify = axios.create({
        baseURL: config.spotify.baseURL,
        timeout: 1000,
        headers: {'Authorization': 'Bearer ' + this.token}
    });

    if (firebase.apps.length === 0) {
        firebase.initializeApp(config.firebase);
    }
  }

  componentWillMount() {
    var _this = this;
    if(this.token) {
      this.spotify.get('me/')
      .then(res => {
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                  const rootRef = firebase.database().ref('users/' + user.uid);
                  
                  rootRef.child('profile').set(res.data);
                  _this.props.authSuccess();
              }
            });

      }).catch(err => {
          //console.log(err);
          _this.props.authError();
      });
    } else {
          _this.props.authError();
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

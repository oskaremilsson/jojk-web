import React, { Component } from 'react';
import config from './../../config.json';
import queryString from 'query-string'
import axios from 'axios';
import * as firebase from "firebase";

import './../styles/Auth.css';

import Images from './../images/Images';

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state= {
            status: 'Loading...'
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }
    }
    componentDidMount() {
        this.getAuthToken();
    }

    getCode() {
        var query = queryString.parse(location.search);
        return query.code;
    }

    getAuthToken() {
        var _this = this;
        this.setState({status:'Connecting to Spotify'});
        axios.get(config.auth.URL + '?code=' + this.getCode())
        .then(res => {
            localStorage.setItem('refresh_token', res.data.refresh_token);
            localStorage.setItem('access_expires', Date.now() + res.data.expires_in*1000);
            
            _this.setState({status:'Connecting to JoJk.'});
            firebase.auth().signInWithCustomToken(res.data.firebase_token).catch(function(error) {
                console.log(error);
                _this.setState({status:error.toString()});
            });

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    _this.props.authSuccess(user, res.data.access_token);
                }
            });

          })
          .catch(err => {
            console.log(err);
            _this.setState({status:err.toString()});
          });
      }

  render() {
    return (
        <div className="Auth">
            <div className="Auth-loading">
                <img src={Images.logo} className="Auth-logo" alt="logo" />
                <div className="Status">{this.state.status}</div>
            </div>
        </div>
    );
  }
}


export default Auth;

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import * as firebase from "firebase";
import axios from 'axios';
import config from './../../config.json';

import './../styles/AppRouter.css';

import Images from './../images/Images';

import CheckLoginStatus from './CheckLoginStatus';
import Login from './Login';
import Logout from './Logout';
import Auth from './Auth';
import App from './App';

class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loggedIn: 'startup',
        token: undefined,
        user: undefined
    }

    if (firebase.apps.length === 0) {
      firebase.initializeApp(config.firebase);
    }

    this.authSuccess = this.authSuccess.bind(this);
    this.authError = this.authError.bind(this);
    this.loggedOut = this.loggedOut.bind(this);
  }

  authSuccess(user, token) {
    let _this = this;
    // Get profile-information from spotify api and store in firebase
    let spotify = axios.create({
      baseURL: config.spotify.baseURL
    });
    spotify.interceptors.request.use(function (config) {
        config.headers['Authorization'] = 'Bearer ' + token;
        return config;
    });

    const rootRef = firebase.database().ref('users/' + btoa(user.uid));
    Promise.all([spotify.get('me'), 
                spotify.get('me/top/artists?limit=5&time_range=short_term'), 
                spotify.get('me/top/tracks?limit=5&time_range=short_term')]).then(res => {
        let me = res[0].data;
        me.when = Date.now();
        rootRef.child('profile').set(me);
        rootRef.child('profile/top_artists').set(res[1].data.items);
        rootRef.child('profile/top_tracks').set(res[2].data.items);

        _this.setState({
          loggedIn:true, 
          token: token,
          user: me.id
        });

        if (this.props.history.location.pathname === '/auth') {
          this.props.history.replace('/');
        }
    }).catch(err => {
      localStorage.removeItem('refresh_token');
      this.setState({loggedIn:false});
    });
  }

  authError() {
    this.setState({loggedIn:false});
  }

  loggedOut() {
    this.props.history.replace('/');
    this.setState({loggedIn:false});
  }

  render() {
    if (this.state.loggedIn === 'startup') {
      return (
        <div className="AppRouter">
          <CheckLoginStatus
                authSuccess={this.authSuccess}
                authError={this.authError} />
          <div className="Start-loading">
              <img src={Images.logo} className="Start-logo" alt="logo" />
          </div>
      </div>
      );
    }
    if (this.state.loggedIn && this.state.token) {
      return (
          <div>
            <Route exact={true} path="/logout" render={(props) => ( <Logout loggedOut={this.loggedOut} /> )} />
            <Route path="/" render={(props) => (<App token={this.state.token} user={this.state.user}/> )} />
          </div>
      );
    }
    else {
      return (
          <div>
            <Switch>
              <Route exact={ true } path="/auth:code?" render={ 
                (props) => ( <Auth 
                                authSuccess={this.authSuccess}
                                authError={this.authError}
                              />)}/>
              <Route path="/" component={ Login }/>
            </Switch>
          </div>
      );
    }
  }
}


export default AppRouter;

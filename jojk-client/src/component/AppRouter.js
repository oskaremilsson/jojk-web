import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

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
        loggedIn: 'startup'
    }

    this.authSuccess = this.authSuccess.bind(this);
    this.authError = this.authError.bind(this);
    this.loggedOut = this.loggedOut.bind(this);
  }

  authSuccess() {
    this.setState({loggedIn:true});
    if (this.props.history.location.pathname === '/auth') {
      this.props.history.replace('/');
    }
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
    if (this.state.loggedIn) {
      return (
          <div>
            <Route exact={true} path="/logout" render={(props) => ( <Logout loggedOut={this.loggedOut} /> )} />
            <Route path="/" component={App}  />
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

import React, { Component } from 'react';
import config from './../../config.json';
import './../styles/Login.css';

import Images from './../images/Images';
import Spotify from 'mdi-react/SpotifyIcon';

class Login extends Component {
    render() {
        const spotify = 'https://accounts.spotify.com/authorize?response_type=code&client_id='+config.spotify.client_id+'&scope=user-read-recently-played%20user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state%20playlist-read-collaborative%20playlist-read-private%20playlist-modify-private%20playlist-modify-public&redirect_uri=' + config.spotify.redirectURL;
        return (
            <div className="Login">
                <div className="Background"></div>
                <div className="App-header">
                    <div>
                        <img src={Images.logo} className="App-logo" alt="logo" />
                    </div>
                    <a href={ spotify }>
                        <div className="Button">
                            <Spotify className="Spotify-icon"/>
                            <span>Connect with Spotify</span>
                        </div>
                    </a>
                </div>
            </div>
        );
  }
}


export default Login;

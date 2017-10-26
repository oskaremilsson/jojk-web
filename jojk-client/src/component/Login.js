import React, { Component } from 'react';
import config from './../../config.json';
import * as firebase from "firebase";
import './../styles/Login.css';

import Images from './../images/Images';
import Spotify from 'mdi-react/SpotifyIcon';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stats: undefined
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }
    }

    componentDidMount() {
        let _this = this;
        const statsRef = firebase.database().ref('stats/counts');
        statsRef.once('value').then(res => {
            _this.setState({stats: res.val()});
        });
    }

    render() {
        const spotify = 'https://accounts.spotify.com/authorize?response_type=code&client_id='+config.spotify.client_id+'&scope=user-read-recently-played%20user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state%20playlist-read-collaborative%20playlist-read-private%20playlist-modify-private%20playlist-modify-public%20user-top-read&redirect_uri=' + config.spotify.redirectURL;
        let users = this.state.stats ? this.state.stats.users : undefined;
        let regions = this.state.stats ? this.state.stats.regions : undefined;
        let tracks = this.state.stats ? this.state.stats.tracks : undefined;
        return (
            <div className="Login">
                <div className="Background"></div>
                <div className="App-header">
                    <div className="Logo-wrapper">
                        <img src={Images.logo} className="App-logo" alt="logo" />
                        <h1>Discover what's playing</h1>
                    </div>

                    <div className="Stats">
                            <h3><span className='Number'>{users || '?'}</span> JoJkers
                                in <span className='Number'>{regions || '?'}</span> regions
                                has shared more than <span className='Number'>{tracks || '?'}</span> tracks.
                            </h3>
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

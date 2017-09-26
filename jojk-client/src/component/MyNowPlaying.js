import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';
import axios from 'axios';

import './../styles/MyNowPlaying.css';

import PlayerControl from './PlayerControl'

class MyNowPlaying extends Component {
    constructor(props) {
        super(props);

        this.state = {
            track: undefined,
            pollSpotify: undefined
        };

        var token = localStorage.getItem('access_token');
        this.spotify = axios.create({
            baseURL: config.spotify.baseURL,
            timeout: 900,
            headers: {'Authorization': 'Bearer ' + token}
        });

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

    }

    getNowPlayingFromSpotify() {
        var _this = this;

        this.spotify.get('me/player')
        .then(res => {
            _this.setState({
                track: res.data.item,
                is_playing: res.data.is_playing,
                progress_ms: res.data.progress_ms,
                shuffle_state: res.data.shuffle_state,
                repeat_state: res.data.repeat_state
            });
            

            if (res.status === 200) {
                var user = firebase.auth().currentUser;
                if (user) {
                    var username = user.uid;
                    const rootRef = firebase.database().ref('users/' + username);

                    rootRef.child('nowplaying/is_playing').set(res.data.is_playing);
                    rootRef.child('nowplaying/progress_ms').set(res.data.progress_ms);
                    rootRef.child('nowplaying/track').set(res.data.item);
                }
            }

            if (localStorage.getItem('access_expires')) {
                //if less than 30 mins left
                var timeToExpire = (localStorage.getItem('access_expires') - Date.now())/1000;
                if (timeToExpire < 1300) {
                    _this.renewAuthToken();
                }
            }
        }).catch(err => {
            //console.log(err);
        });
    }

    renewAuthToken() {
        var token = localStorage.getItem('refresh_token');
        axios.get(config.auth.URL +'?refresh=' + token)
        .then(res => {
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem('access_expires', Date.now() + res.data.expires_in*1000);
        })
        .catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        var _this = this;
        this.getNowPlayingFromSpotify();
        clearInterval(this.state.pollSpotify);
        var pollSpotify = setInterval(function() {
            _this.getNowPlayingFromSpotify();
        }, 5000);

        this.setState({pollSpotify: pollSpotify});
    }

    componentWillUnmount() {
        clearInterval(this.state.pollSpotify);
     }

    render() {
        if (this.state.track) {
            var track = this.state.track;
            return (
                <div className="MyNowPlaying">
                    <PlayerControl 
                        track={track} 
                        is_playing={this.state.is_playing} 
                        progress_ms={this.state.progress_ms}
                        shuffle_state={this.state.shuffle_state}
                        repeat_state={this.state.repeat_state}
                        />
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}


export default MyNowPlaying;
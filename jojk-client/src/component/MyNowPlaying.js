import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';
import axios from 'axios';
import dateformat from 'dateformat';

import './../styles/MyNowPlaying.css';

import PlayerControl from './PlayerControl'

class MyNowPlaying extends Component {
    constructor(props) {
        super(props);

        this.state = {
            track: undefined,
            pollSpotify: undefined,
            prev_track: undefined,
        };

        this.spotify = axios.create({
            baseURL: config.spotify.baseURL
        });
        let _this = this;
        this.spotify.interceptors.request.use(function (config) {
            config.headers['Authorization'] = 'Bearer ' + _this.props.token;
            return config;
        });
        this.spotify.interceptors.response.use((response) => {
            return response;
        }, function (error) {
            /*if (error.response.status === 401) {
                _this.renewAuthToken();
            }*/
            return Promise.reject(error.response);
        });

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

    }

    getNowPlayingFromSpotify() {
        var _this = this;

        this.spotify.get('me/player')
        .then(res => {
            if (res.status === 200 && res.data.item.type === 'track') {
                _this.setState({
                    track: res.data.item,
                    is_playing: res.data.is_playing,
                    progress_ms: res.data.progress_ms,
                    shuffle_state: res.data.shuffle_state,
                    repeat_state: res.data.repeat_state,
                    is_restricted: res.data.device.is_restricted
                });

                var user = firebase.auth().currentUser;
                if (user) {
                    var username = user.uid;
                    const rootRef = firebase.database().ref('users/' + btoa(username));

                    rootRef.child('nowplaying/is_playing').set(res.data.is_playing);
                    rootRef.child('nowplaying/progress_ms').set(res.data.progress_ms);
                    rootRef.child('nowplaying/track').set(res.data.item);
                }

                if (_this.props.location) {
                    _this.jojkTrack(res.data.item, res.data.context, res.data.progress_ms);
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
            if (err.status === 401) {
                _this.renewAuthToken();
            }
        });
    }

    jojkTrack(track, context, progress_ms) {
        var user = firebase.auth().currentUser;
        if (user) {
            var username = user.uid;
            const prevRef = firebase.database().ref('users/' + btoa(username) + '/prev_track');

            prevRef.once('value').then(prev_track => {
                if (prev_track.val() !== track.id && progress_ms > track.duration_ms/3) {
                    // new song played with progess greater than 1/3 of the song
                    // jojk it and store as new previous
                    const jojksRef = firebase.database().ref('jojks/' + this.props.location.country + '/' + this.props.location.city);
                    let jojkInfo = {
                        track: track,
                        context: context,
                        user: username, 
                        when: Date.now()};
                    jojksRef.child(btoa(username) + dateformat(Date.now(), 'yymdHH') + track.id).set(jojkInfo);
                    prevRef.set(track.id);

                    const citiesRef = firebase.database().ref('cities/' + this.props.location.country);
                    citiesRef.child(this.props.location.city + '/key').set(this.props.location.city);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    renewAuthToken() {
        let _this = this;
        clearInterval(this.state.pollSpotify);
        var token = localStorage.getItem('refresh_token');
        axios.get(config.auth.URL +'?refresh=' + token)
        .then(res => {
            _this.props.setToken(res.data.access_token);
            localStorage.setItem('access_expires', Date.now() + res.data.expires_in*1000);

            this.activateSpotifyInterval(config.spotify.refresh_rate);
        })
        .catch(err => {
            console.log(err);
        });
    }

    activateSpotifyInterval(ticktime) {
        var _this = this;
        clearInterval(this.state.pollSpotify);
        var pollSpotify = setInterval(function() {
            _this.getNowPlayingFromSpotify();
        }, ticktime);

        this.setState({pollSpotify: pollSpotify});
    }

    componentDidMount() {
        this.getNowPlayingFromSpotify();
        this.activateSpotifyInterval(config.spotify.refresh_rate);
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
                        token={this.props.token}
                        track={track} 
                        is_playing={this.state.is_playing} 
                        progress_ms={this.state.progress_ms}
                        shuffle_state={this.state.shuffle_state}
                        repeat_state={this.state.repeat_state}
                        is_restricted={this.state.is_restricted}
                        />
                </div>
            );
        } else {
            return (
                <div className="MyNowPlaying">
                <PlayerControl
                    token={this.props.token}
                    />
                </div>
            );
        }
    }
}


export default MyNowPlaying;
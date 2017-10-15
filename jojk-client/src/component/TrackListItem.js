import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';

import PlaylistPicker from './PlaylistPicker';

import './../styles/TrackListItem.css';

import Play from 'mdi-react/PlayIcon';
import Pause from 'mdi-react/PauseIcon';
import PlaylistAdd from 'mdi-react/PlaylistPlusIcon';

class TrackListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            playing: false
        }

        this.spotify = axios.create({
            baseURL: config.spotify.baseURL
        });
        let _this = this;
        this.spotify.interceptors.request.use(function (config) {
            config.headers['Authorization'] = 'Bearer ' + _this.props.token;
            return config;
        });
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.togglePlaylistPicker = this.togglePlaylistPicker.bind(this);
        this.addToPlaylist = this.addToPlaylist.bind(this);
    }

    togglePlaylistPicker() {
        this.setState({showPlaylistPicker: !this.state.showPlaylistPicker});
    }

    addToPlaylist(playlistUri) {
        let playlist = playlistUri.split(':');
        let userID = playlist[2];
        let playlistID = playlist[4];
        this.spotify.post(`users/${userID}/playlists/${playlistID}/tracks`,  {
            "uris": [this.props.track.uri]
        }).then(res => {
            /* TODO: show some notification-stuff */
        });
    }

    toggleExpanded() {
        this.setState({expanded:!this.state.expanded});
        if (!this.state.expanded && this.audio) {
            this.audio.pause();
        }
        this.setState({playing:false});
    }

    togglePlay() {
        if (this.state.playing) {
            this.audio.pause();
        } else {
            let _this = this;
            this.audio.play();
            this.audio.addEventListener('ended', function() { 
                _this.setState({playing:false});
             }, false);
        }
        this.setState({playing:!this.state.playing});
    }

    componentDidUpdate() {
        if (this.state.expanded && this.audio.src === '') {
            this.audio.src = this.props.track.preview_url;
            this.audio.load();
        }
    }

    render() {
        let track = this.props.track;
        return (
            <li className="TrackListItem">
                <div className="Basic-info" onClick={this.toggleExpanded}>
                    <img src={track.album.images[track.album.images.length-1].url} alt="track-img"/>
                    <span className="Track-number">{this.props.index + 1}</span>
                    <span className="Track-name">{track.name}</span>
                </div>
                { this.state.expanded ? 
                    <div className={'More-info' + (this.state.expanded ? ' Active' : '')}>
                            <div className={'Info-button' + (!track.preview_url ? ' Not-available' : '')}
                                onClick={this.togglePlay}>
                                {this.state.playing ? <Pause /> : <Play />}
                                <div>Preview</div>
                                <audio ref={(audio) => { this.audio = audio; }}></audio>
                            </div>
                            <div className="Info-button" onClick={this.togglePlaylistPicker}>
                                <PlaylistAdd />
                                <div>Add to playlist</div>
                            </div>
                            {this.state.showPlaylistPicker ? 
                            <PlaylistPicker 
                                callback={this.addToPlaylist} 
                                close={this.togglePlaylistPicker}
                                token={this.props.token}/> : null}
                    </div>
                    
                : null}
            </li>
        );
    }

}

export default TrackListItem;
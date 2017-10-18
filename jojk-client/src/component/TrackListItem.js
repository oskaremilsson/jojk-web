import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Images from './../images/Images';
import PlaylistPicker from './PlaylistPicker';
import './../styles/TrackListItem.css';

import Play from 'mdi-react/PlayIcon';
import Pause from 'mdi-react/PauseIcon';
import PlaylistAdd from 'mdi-react/PlaylistPlusIcon';
import Dots from 'mdi-react/DotsHorizontalIcon';
import Album from 'mdi-react/DiskIcon';
import Artist from 'mdi-react/AccountMultipleIcon';

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

    makeArtistDom(track) {
        var artists = [];
        var artist, comma = ', ';
        for (var i = 0; i < track.artists.length; i++) {
            artist = track.artists[i];
            if (i >= track.artists.length - 1) {
                comma = '';
            }
            artists.push(artist.name + comma);
        }
        return artists;
    }

    render() {
        let track = this.props.track;
        let coverImg = null;
        if (track.album) {
            coverImg = track.album.images.length > 0 ? track.album.images[2].url : Images.cover;
        }
        let artists = this.makeArtistDom(track);
        return (
            <li className={'TrackListItem' + (this.state.expanded ? ' Active' : '')}>
                <div className="Basic-info" onClick={this.toggleExpanded}>
                    <div>
                        { track.album ?
                            <img src={coverImg} alt="track-img"/>
                            : null
                        }
                        <span className="Track-number">{this.props.index ? this.props.index : null}</span>
                        <div className="Track-title">
                            { this.props.show_artist ?
                                <span className="Track-artist">{artists}</span>
                            : null}
                            <span className="Track-name">{track.name}</span>
                        </div>
                    </div>
                    <div className="More-icon">
                        <Dots />
                    </div>
                </div>
                { this.state.expanded ? 
                    <div className={'More-info' + (this.state.expanded ? ' Active' : '')}>
                        <div className={'Info-button' + (!track.preview_url ? ' Not-available' : '')}
                            onClick={this.togglePlay}>
                            {this.state.playing ? <Pause /> : <Play />}
                            <div>Preview</div>
                            <audio ref={(audio) => { this.audio = audio; }}></audio>
                        </div>
                        { this.props.show_artist ?
                            <Link to={'/artist/' + track.artists[0].id}>
                                <div className="Info-button">
                                    <Artist />
                                    <div>Artist</div>
                                </div>
                            </Link>
                        :null}
                        { track.album ?
                            <Link to={'/album/' + track.album.id}>
                                <div className="Info-button">
                                    <Album />
                                    <div>{track.album.album_type}</div>
                                </div>
                            </Link>
                            :null
                        }
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
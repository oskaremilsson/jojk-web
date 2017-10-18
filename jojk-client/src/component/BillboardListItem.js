import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';
import dateformat from 'dateformat';
import { Link } from 'react-router-dom';

import PlaylistPicker from './PlaylistPicker';
import Images from './../images/Images';
import './../styles/BillboardListItem.css';

import Play from 'mdi-react/PlayIcon';
import Pause from 'mdi-react/PauseIcon';
import Album from 'mdi-react/AlbumIcon';
import Artist from 'mdi-react/AccountMultipleIcon';
import Track from 'mdi-react/MusicNoteIcon';
import PlaylistPlay from 'mdi-react/PlaylistPlayIcon';
import PlaylistAdd from 'mdi-react/PlaylistPlusIcon';
import Headphones from 'mdi-react/HeadphonesIcon';
import DownArrow from 'mdi-react/MenuDownIcon';

class BillboardListItem extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            expanded: false,
            playing: false,
            showPlaylistPicker: false
        }

        this.spotify = axios.create({
            baseURL: config.spotify.baseURL,
            timeout: 2000
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

    togglePlaylistPicker() {
        this.setState({showPlaylistPicker: !this.state.showPlaylistPicker});
    }

    addToPlaylist(playlistUri) {
        let playlist = playlistUri.split(':');
        let userID = playlist[2];
        let playlistID = playlist[4];
        this.spotify.post(`users/${userID}/playlists/${playlistID}/tracks`,  {
            "uris": [this.props.jojk.track.uri]
        }).then(res => {
            /* TODO: show some notification-stuff */
        });
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

    componentDidUpdate() {
        if (this.state.expanded && this.audio.src === '') {
            this.audio.src = this.props.jojk.track.preview_url;
            this.audio.load();
        }
    }

    render() {
        let track = this.props.jojk.track;
        let user = this.props.jojk.user;
        let context = this.props.jojk.context;
        if (context) {
            if (context.type === 'playlist') {
                context = context.uri.split(':');
                context = {
                    user: context[2],
                    id: context[4]
                };
            } else {
                context = {
                    id: undefined
                }
            }
        } else {
            context = {
                id: undefined
            }
        }
        let coverImg = track.album.images ? track.album.images[1].url : Images.cover;
        return(
            <li className="BillboardListItem">
                <div className="Basic-info" onClick={this.toggleExpanded}>
                    <div className="Album-cover">
                        <img src={coverImg} alt="album-cover" />
                    </div>
                    <div className="Track-info">
                        <div>{track.name}</div>
                        <div className="Artist">{this.makeArtistDom(track)}</div>
                    </div>
                    <DownArrow className={'Expand-icon' + (this.state.expanded ? ' Active' : '')} />
                </div>
                { this.state.expanded ? 
                <div className={'More-info' + (this.state.expanded ? ' Active' : '')}>
                    <div className="Button-list">
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
                    </div>
                    <div className="Button-list">
                        <Link to={'/album/' + track.album.id}>
                            <div className="Info-button">
                                <Album />
                                <div>{track.album.album_type}</div>
                            </div>
                        </Link>
                        <Link to={'/artist/' + track.artists[0].id}>
                            <div className="Info-button">
                                <Artist />
                                <div>Artist</div>
                            </div>
                        </Link>
                        <div className="Info-button Not-available">
                            <Track />
                            <div>Track</div>
                        </div>
                        {
                            context.id ?
                            <Link to={'/playlist/' + context.user + '/' + context.id}>
                                <div className="Info-button">
                                    <PlaylistPlay />
                                    <div>Playlist</div>
                                </div>
                            </Link>
                            : null
                        }
                    </div>
                    <div className="Jojk-meta">
                        <div className="Timestamp">{dateformat(this.props.jojk.when, 'yyyy-mm-dd HH:MM')}</div>
                        <div className="User">{user} <Headphones className="Icon"/></div>
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

export default BillboardListItem;
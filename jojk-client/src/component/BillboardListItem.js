import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
//import * as firebase from "firebase";
//import config from './../../config.json';
import dateformat from 'dateformat';

import './../styles/BillboardListItem.css';


import Play from 'mdi-react/PlayIcon';
import Pause from 'mdi-react/PauseIcon';
import Album from 'mdi-react/DiskIcon';
import Artist from 'mdi-react/AccountMultipleIcon';
import Track from 'mdi-react/MusicNoteIcon';
import PlaylistPlay from 'mdi-react/PlaylistPlayIcon';
import PlaylistAdd from 'mdi-react/PlaylistPlayIcon';
import Headphones from 'mdi-react/HeadphonesIcon';
import DownArrow from 'mdi-react/MenuDownIcon';

class BillboardListItem extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            expanded: false,
            playing: false
        }

        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
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
            //this.setState({playing:false});
        } else {
            let _this = this;
            this.audio.play();
            //this.setState({playing:true});
            this.audio.addEventListener('ended', function() { 
                _this.setState({playing:false});
             }, false);
        }
        this.setState({playing:!this.state.playing});
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
        var track = this.props.jojk.track;
        var user = this.props.jojk.user;
        return(
            <li className="BillboardListItem">
                <div className="Basic-info" onClick={this.toggleExpanded}>
                    <div className="Album-cover">
                        <img src={track.album.images[1].url} alt="album-cover" />
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
                        <div className="Info-button Not-available">
                            <PlaylistAdd />
                            <div>Add to playlist</div>
                        </div>
                    </div>
                    <div className="Button-list">
                        <div className="Info-button Not-available">
                            <Album />
                            <div>Album</div>
                        </div>
                        <div className="Info-button Not-available">
                            <Artist />
                            <div>Artist</div>
                        </div>
                        <div className="Info-button Not-available">
                            <Track />
                            <div>Track</div>
                        </div>
                        <div className="Info-button Not-available">
                            <PlaylistPlay />
                            <div>Playlist</div>
                        </div>
                    </div>
                    <div className="Jojk-meta">
                        <div className="Timestamp">{dateformat(this.props.jojk.when, 'yyyy-mm-dd HH:MM')}</div>
                        <div className="User">{user} <Headphones className="Icon"/></div>
                    </div>
                </div>
                : null}
            </li>
        );
    }
}

export default BillboardListItem;
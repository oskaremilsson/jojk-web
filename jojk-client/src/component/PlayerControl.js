import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';

import './../styles/PlayerControl.css';

import Seeker from './Seeker'
import RepeatButton from './RepeatButton'

import PlayCirleOutline from 'mdi-react/PlayCircleOutlineIcon';
import PauseCirleOutline from 'mdi-react/PauseCircleOutlineIcon';
import SkipNextCircleOutline from 'mdi-react/SkipNextCircleOutlineIcon';
import SkipPreviousCircleOutline from 'mdi-react/SkipPreviousCircleOutlineIcon';
import ShuffleVariant from 'mdi-react/ShuffleVariantIcon';

class PlayerControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seeker: this.props.progress_ms
        };

        var token = localStorage.getItem('access_token');
        this.spotify = axios.create({
            baseURL: config.spotify.baseURL,
            timeout: 2000,
            headers: {'Authorization': 'Bearer ' + token}
        });

        this.playPauseSpotify = this.playPauseSpotify.bind(this);
        this.nextTrackSpotify = this.nextTrackSpotify.bind(this);
        this.previousTrackSpotify = this.previousTrackSpotify.bind(this);
        this.toggleShuffleSpotify = this.toggleShuffleSpotify.bind(this);
    }

    makeArtistDom(track) {
        var artists = [];
        var artist, comma = ', ';
        for (var i = 0; i < track.artists.length; i++) {
            artist = track.artists[i];
            if (i >= track.artists.length - 1) {
                comma = null;
            }
            artists.push((<span key={artist.id}>{artist.name}{comma}</span>));
        }
        return artists;
    }

    playPauseSpotify() {
        var req = undefined;
        if (this.props.is_playing) {
            req = this.spotify.put('me/player/pause');
        } else {
            req = this.spotify.put('me/player/play');
        }
        
        req.then();
    }

    nextTrackSpotify() {
        this.spotify.post('me/player/next').then();
    }

    previousTrackSpotify() {
        this.spotify.post('me/player/previous').then();
    }

    toggleShuffleSpotify() {
        if (this.props.shuffle_state) {
            this.spotify.put('me/player/shuffle?state=false').then();
        } else {
            this.spotify.put('me/player/shuffle?state=true').then();
        }
    }

    render() {
        if (this.props.track) {
            var track = this.props.track;
            
            var playButton = null;
            if (this.props.is_playing) {
                playButton = (<PauseCirleOutline onClick={this.playPauseSpotify} className="Play-button"/>);
            } else {
                playButton = (<PlayCirleOutline onClick={this.playPauseSpotify} className="Play-button"/>);
            }

            return (
                <div className="PlayerControl">
                    <div className="Playing-info">
                        <div className="Album-cover">
                            <img src={track.album.images[1].url} alt="cover-art"/>
                        </div>
                        <div className="Track-info">
                            <p className="Name">{track.name}</p>
                            <p className="Artist">{this.makeArtistDom(track)}</p>
                        </div>
                    </div>
                    <div className="Buttons">
                        <ShuffleVariant 
                            className={'ShuffleRepeat' + (this.props.shuffle_state ? ' Active' : '')}
                            onClick={this.toggleShuffleSpotify}
                            />
                        <SkipPreviousCircleOutline 
                            onClick={this.previousTrackSpotify} 
                            className="Skip-button"
                            />
                        {playButton}
                        <SkipNextCircleOutline 
                            onClick={this.nextTrackSpotify} 
                            className="Skip-button"
                            />
                        <RepeatButton repeat_state={this.props.repeat_state} />
                    </div>
                    <Seeker 
                        progress_ms={this.props.progress_ms} 
                        duration_ms={track.duration_ms}
                        />
                </div>
            );
        } else {
            return (<div>wat</div>);
        }
    }
}


export default PlayerControl;
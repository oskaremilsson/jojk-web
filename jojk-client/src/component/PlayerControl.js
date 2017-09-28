import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';

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
                comma = '';
            }
            artists.push(artist.name + comma);
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
                playButton = (<PauseCirleOutline 
                                onClick={this.playPauseSpotify}
                                className={'Play-button' + (this.props.is_restricted ? ' Restricted' : '')}/>);
            } else {
                playButton = (<PlayCirleOutline 
                                onClick={this.playPauseSpotify}
                                className={'Play-button' + (this.props.is_restricted ? ' Restricted' : '')}/>);
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
                    <div className="Controller">
                        <div className="Buttons" 
                                data-tip={(this.props.is_restricted ? 'Controller unavailable' : '' )}
                                data-type='error'>
                        <ShuffleVariant
                            className={'ShuffleRepeat' + 
                                        (this.props.shuffle_state ? ' Active' : '' ) + 
                                        (this.props.is_restricted ? ' Restricted' : '')}
                            onClick={this.toggleShuffleSpotify}
                            />
                        <SkipPreviousCircleOutline 
                            onClick={this.previousTrackSpotify} 
                            className={'Skip-button' + (this.props.is_restricted ? ' Restricted' : '')}
                            />
                        {playButton}
                        <SkipNextCircleOutline 
                            onClick={this.nextTrackSpotify} 
                            className={'Skip-button' + (this.props.is_restricted ? ' Restricted' : '')}
                            />
                        <RepeatButton repeat_state={this.props.repeat_state} is_restricted={this.props.is_restricted} />
                        </div>
                    </div>
                    <Seeker 
                        progress_ms={this.props.progress_ms} 
                        duration_ms={track.duration_ms}
                        is_restricted={this.props.is_restricted}
                        />
                    <ReactTooltip 
                        delayShow={100}/>
                </div>
            );
        } else {
            return (<div>wat</div>);
        }
    }
}


export default PlayerControl;
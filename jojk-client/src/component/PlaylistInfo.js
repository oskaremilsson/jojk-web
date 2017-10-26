import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';
import { Link } from 'react-router-dom';

import TrackListItem from './TrackListItem';
import InfoButton from './InfoButton';
import SpotifyIcon from 'mdi-react/SpotifyIcon';

import './../styles/InfoPage.css';
import './../styles/PlaylistInfo.css';

class PlaylistInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user : this.props.match.params.user,
            id : this.props.match.params.id,
            nextTracks: undefined,
            info: undefined,
            tracks: undefined
        }

        this.spotify = axios.create({
            baseURL: config.spotify.baseURL
        });
        let _this = this;
        this.spotify.interceptors.request.use(function (config) {
            config.headers['Authorization'] = 'Bearer ' + _this.props.token;
            return config;
        });
    }

    componentWillMount() {
        let _this = this;
        let code = this.props.location ? this.props.location.country_code : 'SE';
        this.spotify.get('users/' + this.state.user + '/playlists/' + this.state.id + '?market=' + code).then(playlist => {
            _this.setState({
                info: playlist.data,
                tracks: playlist.data.tracks.items,
                nextTracks: playlist.data.tracks.next
            });
            this.fetchMoreTracks();
        });
    }

    fetchMoreTracks() {
        let _this = this;
        this.spotify.get(this.state.nextTracks).then(tracks => {
            _this.setState({
                tracks: [..._this.state.tracks, ...tracks.data.items],
                nextTracks: tracks.data.next
            });
            if (this.state.nextTracks) {
                this.fetchMoreTracks();
            }
        });
    }

    getTracks() {
        let list = (<ul></ul>);
        let items = this.state.tracks;
        if (items) {
            list = (
                <ul className="Tracks">
                    {
                        items.map((item, i)=> (
                            !item.is_local ?
                                <TrackListItem 
                                    key={item.track.id + '_' + i}
                                    token={this.props.token}
                                    track={item.track}
                                    show_artist={true}
                                />
                            :null
                        ))
                    }
                </ul>
            );
        }
        return list;
    }

    render() {
        let info = this.state.info;
        if (info) {
            return (
                <div className="InfoPage PlaylistInfo">
                    <div className="Background" 
                        style={{background: `url(${info.images[0].url})`}}>
                    </div>
                    <div className="Info-wrapper">
                        <div className="Playlist-image" 
                            style={{background: `url(${info.images[0].url})`}}>
                        </div>
                        <h1>{info.name}</h1>
                        <h3 className="Description">{info.description ? '"' + info.description + '"' : null}</h3>
                        <div className="Button-list">
                        <Link to={'/profile/' + info.owner.id}
                                    className="User-button">
                                        <InfoButton text={info.owner.id} />
                        </Link>
                        <a href={info.external_urls.spotify}
                                    className="User-button"
                                    target="_blank">
                                        <InfoButton text="Open in Spotify" icon={<SpotifyIcon />}/>
                        </a>
                        </div>
                        <div className="Tracks-wrapper">
                            <h3>Tracks</h3>
                            {this.getTracks()}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    }

}

export default PlaylistInfo;
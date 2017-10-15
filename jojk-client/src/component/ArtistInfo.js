import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';

import TrackListItem from './TrackListItem';

import './../styles/ArtistInfo.css';

class ArtistInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id : this.props.match.params.id,
            info: undefined,
            tracks: undefined,
            topExpanded: false
        }

        this.spotify = axios.create({
            baseURL: config.spotify.baseURL
        });
        let _this = this;
        this.spotify.interceptors.request.use(function (config) {
            config.headers['Authorization'] = 'Bearer ' + _this.props.token;
            return config;
        });
        this.toggleTopExpand = this.toggleTopExpand.bind(this);
    }

    fetchTopTracks(code) {
        let _this = this;
        this.spotify.get(`/artists/${this.state.id}/top-tracks?country=${code}`).then(tracks => {
            _this.setState({tracks: tracks.data.tracks});
        }).catch(err => {
            console.log(err);
        });
    }

    componentWillReceiveProps(props) {
        let code = props.location ? props.location.country_code : false;
        if (code) {
            this.fetchTopTracks(code);
        }
    }

    componentWillMount() {
        let _this = this;
        this.spotify.get('artists/' + this.state.id).then(artist => {
            _this.setState({info: artist.data});
        });
        let code = this.props.location ? this.props.location.country_code : 'SE';
        this.fetchTopTracks(code);
    }

    toggleTopExpand() {
        this.setState({topExpanded: !this.state.topExpanded});
    }

    getTopTracks() {
        let list;
        let tracks = this.state.tracks;
        let expandend = this.state.topExpanded;
        if (tracks) {
            if (!expandend) {
                tracks = tracks.slice(0, 5);
            }
            list = (
                <ul className="Top-tracks">
                    {
                        tracks.map((track, i) => (
                        <TrackListItem 
                            key={track.id}
                            token={this.props.token}
                            track={track}
                            index={i}
                        />
                        ))
                    }
                    <div className="Expand-button"
                        onClick={this.toggleTopExpand}>Show {expandend ? 'less' : 'more'}</div>
                </ul>
            );
        } else {
            list = (<ul></ul>);
        }
        return list;
    }

    render() {
        let info = this.state.info;
        if (info) {
            return (
                <div className="InfoPage ArtistInfo">
                    <div className="Background" 
                        style={{background: `url(${info.images[0].url})`}}>
                    </div>
                    <div className="Info-wrapper">
                        <div className="Artist-image" 
                            style={{background: `url(${info.images[0].url})`}}>
                        </div>
                        <h1>{info.name}</h1>

                        <div className="Top-tracks-wrapper">
                            <h3>Top tracks</h3>
                            {this.getTopTracks()}
                        </div>

                        <div className="Genres">
                            {
                                info.genres.map(genre => (
                                (<div key={genre}>{genre}</div>)
                                ))
                            }
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

export default ArtistInfo;
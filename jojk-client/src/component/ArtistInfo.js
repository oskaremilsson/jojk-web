import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';

import './../styles/ArtistInfo.css';

class ArtistInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id : this.props.match.params.id,
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

    getTopTracks() {
        let list;
        if (this.state.tracks) {
            list = (
                <ul className="Top-tracks">
                    {
                        this.state.tracks.map(track => (
                        (<li key={track.id}>{track.name}</li>)
                        ))
                    }
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
                    <div className="Background" style={{background: `url(${info.images[0].url})`}}></div>
                    <div className="Info-wrapper">
                        <img src={info.images[0].url} alt="artist-img" className="Artist-image"/>
                        <h1>{info.name}</h1>
                        <div className="Genres">
                            {
                                info.genres.map(genre => (
                                (<div key={genre}>{genre}</div>)
                                ))
                            }
                        </div>

                        <h3>Top tracks</h3>
                        {this.getTopTracks()}
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
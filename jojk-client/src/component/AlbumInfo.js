import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';
import { Link } from 'react-router-dom';

import TrackListItem from './TrackListItem';

import './../styles/InfoPage.css';
import './../styles/AlbumInfo.css';

class AlbumInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id : this.props.match.params.id,
            info: undefined
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
        this.spotify.get('albums/' + this.state.id + '?code=' + code).then(album => {
            _this.setState({info: album.data});
        });
    }

    getTracks() {
        let list = (<ul></ul>);;
        let tracks = this.state.info.tracks.items;
        if (tracks) {
            list = (
                <ul className="Tracks">
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
                </ul>
            );
        }
        return list;
    }

    render() {
        let info = this.state.info;
        if (info) {
            console.log(info);
            return (
                <div className="InfoPage AlbumInfo">
                    <div className="Background" 
                        style={{background: `url(${info.images[0].url})`}}>
                    </div>
                    <div className="Info-wrapper">
                        <div className="Cover-image" 
                            style={{background: `url(${info.images[1].url})`}}>
                        </div>
                        <h3 className="Type">{info.album_type}</h3>
                        <h1>{info.name}</h1>
                        {
                            info.artists.map(artist => (
                                (<Link to={'/artist/' + artist.id} 
                                    className="Artist-button"
                                    key={artist.id}>
                                        {artist.name}
                                </Link>)
                                ))
                        }

                        <div className="Tracks-wrapper">
                            <h3>Tracks</h3>
                            {this.getTracks()}
                        </div>
                        <div className="Genres">
                            {
                                info.genres.map(genre => (
                                (<div key={genre}>{genre}</div>)
                                ))
                            }
                        </div>

                        <div className="Meta-data">
                            <div className="Copyrights">
                                {
                                    info.copyrights[0].text
                                }
                            </div>
                            <span className="Released">Released: {info.release_date}</span>
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

export default AlbumInfo;
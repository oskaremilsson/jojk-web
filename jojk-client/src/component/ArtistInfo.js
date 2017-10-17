import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';
import { Link } from 'react-router-dom';

import TrackListItem from './TrackListItem';

import './../styles/InfoPage.css';
import './../styles/ArtistInfo.css';

class ArtistInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id : this.props.match.params.id,
            info: undefined,
            tracks: undefined,
            albums: undefined,
            singles: undefined,
            topExpanded: false,
            albumExpanded: false,
            singleExpanded: false,
            albumShowCount: 4
        }

        this.spotify = axios.create({
            baseURL: config.spotify.baseURL
        });
        let _this = this;
        this.spotify.interceptors.request.use(function (config) {
            config.headers['Authorization'] = 'Bearer ' + _this.props.token;
            return config;
        });
        this.toggleTopExpanded = this.toggleTopExpanded.bind(this);
        this.toggleAlbumExpanded = this.toggleAlbumExpanded.bind(this);
        this.toggleSingleExpanded = this.toggleSingleExpanded.bind(this);
    }

    fetchTopTracks(code) {
        let _this = this;
        this.spotify.get(`/artists/${this.state.id}/top-tracks?country=${code}`).then(tracks => {
            _this.setState({tracks: tracks.data.tracks});
        }).catch(err => {
            console.log(err);
        });
    }

    fetchAlbums(code) {
        let _this = this;
        this.spotify.get(`/artists/${this.state.id}/albums?market=${code}&album_type=album`).then(albums => {
            if (albums.data.items.length > 0) {
                _this.setState({albums: albums.data.items});
            }
        }).catch(err => {
            console.log(err);
        });
    }

    fetchSingles(code) {
        let _this = this;
        this.spotify.get(`/artists/${this.state.id}/albums?market=${code}&album_type=single`).then(singles => {
            if (singles.data.items.length > 0) {
                _this.setState({singles: singles.data.items});
            }
        }).catch(err => {
            console.log(err);
        });
    }

    componentWillReceiveProps(props) {
        let code = props.location && (!this.state.albums || !this.state.tracks) ? props.location.country_code : false;
        if (code) {
            this.fetchTopTracks(code);
            this.fetchAlbums(code);
            this.fetchSingles(code);
        }
    }

    componentWillMount() {
        let _this = this;
        this.spotify.get('artists/' + this.state.id).then(artist => {
            _this.setState({info: artist.data});
        });
        let code = this.props.location ? this.props.location.country_code : 'SE';
        this.fetchTopTracks(code);
        this.fetchAlbums(code);
        this.fetchSingles(code);
    }

    toggleTopExpanded() {
        this.setState({topExpanded: !this.state.topExpanded});
    }

    toggleAlbumExpanded() {
        this.setState({albumExpanded: !this.state.albumExpanded});
    }

    toggleSingleExpanded() {
        this.setState({singleExpanded: !this.state.singleExpanded});
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
                    {
                        this.state.tracks.length > 5 ?
                            <div className="Expand-button"
                                onClick={this.toggleTopExpanded}>
                                Show {expandend ? 'less' : 'more'}
                            </div>
                        : null
                    }
                </ul>
            );
        } else {
            list = (<ul></ul>);
        }
        return list;
    }

    getAlbums() {
        let list;
        let albums = this.state.albums;
        let expandend = this.state.albumExpanded;
        if (!expandend) {
            albums = albums.slice(0, this.state.albumShowCount);
        }

        list = (
            <ul className="Albums">
                {
                    albums.map(album => (
                        <Link to={'/album/' + album.id} key={album.id}>
                            <li>
                                <img src={album.images[1].url} alt="cover-img"/>
                                <h3>{album.name}</h3>
                            </li>
                        </Link>
                    ))
                }
            </ul>
        );
        
        return list;
    }

    getSingles() {
        let list;
        let singles = this.state.singles;
        let expandend = this.state.singleExpanded;
        if (!expandend) {
            singles = singles.slice(0, this.state.albumShowCount);
        }
        
        list = (
            <ul className="Albums">
                {
                    singles.map(single => (
                        <Link to={'/album/' + single.id} key={single.id}>
                            <li>
                                <img src={single.images[1].url} alt="cover-img"/>
                                <h3>{single.name}</h3>
                            </li>
                        </Link>
                    ))
                }
            </ul>
        );
        
        return list;
    }

    render() {
        let info = this.state.info;
        let albums = this.state.albums;
        let singles = this.state.singles;
        if (info) {
            return (
                <div className="InfoPage ArtistInfo">
                    <div className="Background" 
                        style={{background: `url(${info.images[0].url})`}}>
                    </div>
                    <div className="Info-wrapper">
                        <div className="Artist-image" 
                            style={{background: `url(${info.images[1].url})`}}>
                        </div>
                        <h1>{info.name}</h1>

                        <div className="Top-tracks-wrapper">
                            <h3>Popular tracks</h3>
                            {this.getTopTracks()}
                        </div>

                        {
                            albums ? 
                                <div className="Album-wrapper">
                                    <h3>Albums</h3>
                                    {this.getAlbums()}
                                    {
                                        this.state.albums.length > this.state.albumShowCount ?
                                            <div className="Expand-button"
                                                onClick={this.toggleAlbumExpanded}>
                                                Show {this.state.albumExpanded ? 'latest' : 'all'}
                                            </div>
                                        : null
                                    }
                                </div>
                            : null 
                        }

                        {
                            singles ? 
                                <div className="Album-wrapper">
                                    <h3>Singles</h3>
                                    {this.getSingles()}
                                    {
                                        this.state.singles.length > this.state.albumShowCount ?
                                            <div className="Expand-button"
                                                onClick={this.toggleSingleExpanded}>
                                                Show {this.state.singleExpanded ? 'latest' : 'all'}
                                            </div>
                                        : null
                                    }
                                </div>
                            : null 
                        }

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
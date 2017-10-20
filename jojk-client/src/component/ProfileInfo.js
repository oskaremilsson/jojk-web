import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';
import { Link } from 'react-router-dom';
import dateformat from 'dateformat';

import TrackListItem from './TrackListItem';
import Images from './../images/Images';

import './../styles/InfoPage.css';
import './../styles/ProfileInfo.css';

class ProfileInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user : this.props.match ? this.props.match.params.user : this.props.user,
            profile: undefined
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }
    }

    componentDidMount() {
        this.getProfile(this.state.user);
    }

    getProfile(user) {
        let _this = this;

        const rootRef = firebase.database().ref('users/' + btoa(user));
        
        rootRef.child('profile').once('value').then(profile => {
            if (profile.val()) {
                _this.setState({profile: profile.val()});
            }
        });
    }

    getTopTracks() {
        let list = (<ul></ul>);
        let tracks = this.state.profile.top_tracks;
        if (tracks) {
            list = (
                <ul className="Top-tracks">
                    {
                        tracks.map((track, i) => (
                        <TrackListItem 
                            key={track.id}
                            token={this.props.token}
                            track={track}
                            index={i + 1}
                            show_artist={true}
                        />
                        ))
                    }
                </ul>
            );
        }
        return list;
    }

    getTopArtists() {
        let list = (<ul></ul>);
        let artists = this.state.profile.top_artists;
        if (artists) {
            list = (
                <ul className="Top-artists">
                    {
                        artists.map((artist, i) => (
                            <Link to={'/artist/' + artist.id} key={artist.id}>
                            <li style={{background: `url(${artist.images.length > 0 ? artist.images[1].url : Images.cover})`}}>
                                <h3>{artist.name}</h3>
                            </li>
                            </Link>
                        ))
                    }
                </ul>
            );
        }
        return list;
    }

    componentDidUpdate() {
        if (this.props.match) {
            if (this.props.match.params.user !== this.state.user) {
                this.setState({user: this.props.match.params.user});
                this.getProfile(this.props.match.params.user);
            }
        }
    }

    render() {
        let info = this.state.profile;
        if (info) {
            let profileImg = info.images ? info.images[0].url : Images.cover;
            return (
                <div className="InfoPage ProfileInfo">
                    <div className="Background" 
                        style={{background: `url(${profileImg})`}}>
                    </div>
                    <div className="Info-wrapper">
                        <div className="Profile-image" 
                            style={{background: `url(${profileImg})`}}>
                        </div>
                        <h3 className="Type">{info.display_name ? info.display_name : info.id}</h3>

                        {this.state.profile.top_tracks ? 
                            <div className="Tracks-wrapper">
                                <h3>Top tracks</h3>
                                {this.getTopTracks()}
                            </div>
                        :null}

                        {this.state.profile.top_artists ? 
                            <div className="Artists-wrapper">
                                <h3 className="Top-artists-title">Top artists</h3>
                                {this.getTopArtists()}
                            </div>
                        :null}

                        <div className="Meta-data">
                            { info.when?
                                <div className="updated">Profile updated: {dateformat(info.when, 'yyyy-mm-dd')}</div>
                            :null}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (<div className="InfoPage ProfileInfo">
                <h3 className="Type">Profile not found</h3>
            </div>);
        }
    }

}

export default ProfileInfo;
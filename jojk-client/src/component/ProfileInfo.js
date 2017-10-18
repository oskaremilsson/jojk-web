import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';
//import { Link } from 'react-router-dom';

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

    componentWillMount() {
        let _this = this;
        const rootRef = firebase.database().ref('users/' + this.state.user);

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
                <ul className="Tracks">
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
                        <h3 className="Type">{info.display_name}</h3>

                        <div className="Tracks-wrapper">
                            <h3>Top tracks right now</h3>
                            {this.getTopTracks()}
                        </div>

                        <div className="Meta-data">
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

export default ProfileInfo;
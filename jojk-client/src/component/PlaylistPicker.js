import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';
import * as firebase from "firebase";

import './../styles/PlaylistPicker.css';

import Close from 'mdi-react/CloseIcon';

class PlaylistPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        }

        var token = localStorage.getItem('access_token');
        this.spotify = axios.create({
            baseURL: config.spotify.baseURL,
            timeout: 2000,
            headers: {'Authorization': 'Bearer ' + token}
        });

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

        this.chosen = this.chosen.bind(this);
    }

    chosen(e) {
        this.props.callback(e.target.id);
    }
    
    componentWillMount() {
        let _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                _this.spotify.get('me/playlists?limit=50').then(res => {
                    let list = [];
                    res.data.items.forEach(playlist => {
                        if (playlist.owner.id === user.uid) {
                            list.push(playlist);
                        }
                    });
                    _this.setState({list: list});
                });
            }
        });
        
    }

    render() {
        return (
            <div className='PlaylistPicker' onClick={this.props.close}>
                <div className='PlaylistPicker-inner'>
                    <h1>Add to playlist <Close className="Icon"/></h1>
                    <ul>
                        {
                            this.state.list.map((item) => (
                                <li user={item.owner.id} id={item.uri} key={item.id} onClick={this.chosen}>{item.name}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default PlaylistPicker;

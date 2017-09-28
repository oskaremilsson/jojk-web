import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
//import * as firebase from "firebase";
//import config from './../../config.json';

import './../styles/BillboardListItem.css';
import Headphones from 'mdi-react/HeadphonesIcon';

class BillboardListItem extends Component {
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

    render() {
        var track = this.props.jojk.track;
        var user = this.props.jojk.user;
        return(
            <li className="BillboardListItem">
                <div className="Album-cover">
                    <img src={track.album.images[1].url} alt="album-cover" />
                </div>
                <div className="Track-info">
                    <div>{track.name}</div>
                    <div className="Artist">{this.makeArtistDom(track)}</div>
                </div>
                <div className="User">
                    <Headphones className="Icon"/>{user}
                </div>
            </li>
        );
    }
}

export default BillboardListItem;
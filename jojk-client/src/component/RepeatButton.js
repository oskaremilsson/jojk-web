import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';

import Repeat from 'mdi-react/RepeatIcon';
import RepeatOnce from 'mdi-react/RepeatOnceIcon';

class RepeatButton extends Component {
    constructor(props) {
        super(props);

        this.spotify = axios.create({
            baseURL: config.spotify.baseURL
        });
        let _this = this;
        this.spotify.interceptors.request.use(function (config) {
            config.headers['Authorization'] = 'Bearer ' + _this.props.token;
            return config;
        });

        this.turnOffRepeat = this.turnOffRepeat.bind(this);
        this.toggleRepeat = this.toggleRepeat.bind(this);
    }

    turnOffRepeat() {
        this.spotify.put('me/player/repeat?state=off').then();
    }

    toggleRepeat() {
        if (this.props.repeat_state === 'off') {
            this.spotify.put('me/player/repeat?state=context').then();
        } else {
            this.spotify.put('me/player/repeat?state=track').then();
        }
    }

    render() {
        var repeatButton;
        if (this.props.repeat_state === 'track') {
            repeatButton = (<RepeatOnce
                className={'ShuffleRepeat Active' + (this.props.is_restricted ? ' Restricted' : '')}
                onClick={this.turnOffRepeat}
                />);
        } else {
            repeatButton = (<Repeat
                className={'ShuffleRepeat' + 
                            (this.props.repeat_state === 'context' ? ' Active' : '') +
                            (this.props.is_restricted ? ' Restricted' : '')}
                onClick={this.toggleRepeat}
                />);
        }
        return repeatButton;
    }

}

export default RepeatButton;
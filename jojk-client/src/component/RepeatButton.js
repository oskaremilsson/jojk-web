import React, { Component } from 'react';
import config from './../../config.json';
import axios from 'axios';

import Repeat from 'mdi-react/RepeatIcon';
import RepeatOnce from 'mdi-react/RepeatOnceIcon';

class RepeatButton extends Component {
    constructor(props) {
        super(props);

        var token = localStorage.getItem('access_token');
        this.spotify = axios.create({
            baseURL: config.spotify.baseURL,
            timeout: 2000,
            headers: {'Authorization': 'Bearer ' + token}
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
                className={'ShuffleRepeat Active'}
                onClick={this.turnOffRepeat}
                />);
        } else {
            repeatButton = (<Repeat
                className={'ShuffleRepeat' + (this.props.repeat_state === 'context' ? ' Active' : '')}
                onClick={this.toggleRepeat}
                />);
        }
        return repeatButton;
    }

}

export default RepeatButton;
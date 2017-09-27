import React, { Component } from 'react';
import Slider from 'react-rangeslider'
import config from './../../config.json';
import axios from 'axios';

import 'react-rangeslider/lib/index.css'
import './../styles/Seeker.css';

class Seeker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seeker: this.props.progress_ms
        };

        var token = localStorage.getItem('access_token');
        this.spotify = axios.create({
            baseURL: config.spotify.baseURL,
            timeout: 2000,
            headers: {'Authorization': 'Bearer ' + token}
        });

        this.slideSeeker = this.slideSeeker.bind(this);
        this.moveSeeker = this.moveSeeker.bind(this);
        this.seekSpotify = this.seekSpotify.bind(this);
    }

    moveSeeker(value) {
        this.setState({seeker: value});
    }

    slideSeeker(value) {
        console.log(value);
    }

    seekSpotify() {
        this.spotify.put('me/player/seek?position_ms=' + this.state.seeker).then();
    }

    componentWillReceiveProps(nextProps) {
        var diff = nextProps.progress_ms - this.props.progress_ms;
        if (diff < 5000 && diff > -5000) {
            this.setState({seeker: this.props.progress_ms});
        }
    }

    render() {
        const {seeker} = this.state;
        return (
            <div className={'Seeker' + (this.props.is_restricted ? ' Restricted' : '')}>
                <Slider
                        min={0}
                        max={this.props.duration_ms}
                        value={seeker}
                        tooltip={false}
                        
                        onChange={this.moveSeeker}
                        onChangeComplete={this.seekSpotify}
                    />
            </div>
        );
  }
}


export default Seeker;

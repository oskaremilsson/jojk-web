import React, { Component } from 'react';
import * as firebase from "firebase";
import config from './../../config.json';
import './../styles/Billboard.css';

import BillboardListItem from './BillboardListItem';
import Loading from './Loading';
import LocationIcon from 'mdi-react/MapMarkerIcon';
import InfoButton from './InfoButton';

class Billboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listening: false,
            jojks: [],
            jojksRef: undefined,
            city: 'Unknown',
            loaded: false,
            loadMore: false
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

        this.loadMoreTracks = this.loadMoreTracks.bind(this);
    }

    getLocation() {
        var location = {};
        if (this.props.match) {
            location.city = this.props.match.params.city;
            location.country = this.props.match.params.country;
        } else if (this.props.userLocation) {
            location.city = this.props.userLocation.city;
            location.country = this.props.userLocation.country;
        }
        return location;
    }

    componentDidUpdate() {
        let location = this.getLocation();
        if (location.city) {
            if (this.state.city !== location.city) {
                if(this.state.jojksRef) {
                    this.state.jojksRef.off();
                    this.setState({
                        listening: false,
                        loaded: false,
                        loadMore: false,
                        jojks: []
                        });
                }
                this.listenForJojks(location);
            }
        } else {
            if (this.state.city !== 'Unknown') {
                this.setState({
                    city: 'Unknown',
                    listening: false,
                    loaded: true,
                    loadMore: false,
                    jojks: []
                });
            }
        }
    }
    componentDidMount() {
        var location = this.getLocation();
        this.listenForJojks(location);
    }

    loadMoreTracks() {
        let _this = this;
        let jojk, jojks = [], isMore = true;
        let preload = 30;
        let location = this.getLocation();
        let lastJojk = this.state.jojks[this.state.jojks.length - 1];
        var jojksRef = firebase.database().ref('jojks/' + location.country + '/' + location.city).orderByChild('when').limitToLast(preload).endAt(lastJojk.jojk.when, lastJojk.key);
        this.setState({loaded: false});
        jojksRef.once('value').then(data => {
            if (data.val()) {
                Object.keys(data.val()).forEach(key => {
                    if (key !== lastJojk.key) {
                        jojk = data.val()[key];
                        jojks.push({key:key,jojk:jojk});
                    }
                });

                if (jojks.length < preload - 1) {
                    isMore = false;
                }

                jojks.sort(this.compare);
                _this.setState({
                    jojks: [...this.state.jojks, ...jojks],
                    loadMore: isMore,
                    loaded: true
                });
            }
        });
    }

    compare(a,b) {
        if (a.jojk.when < b.jojk.when)
          return 1;
        if (a.jojk.when > b.jojk.when)
          return -1;
        return 0;
      }

    listenForJojks(location) {
        var _this = this;
        let preload = 30;
        if (location.city && !this.state.listening) {
             var jojksRef = firebase.database().ref('jojks/' + location.country + '/' + location.city).orderByChild('when').limitToLast(preload);

             this.setState(
                 {
                    listening: true,
                    jojksRef: jojksRef,
                    city: location.city
                });

            jojksRef.once('value').then(data => {
                let jojk, jojks = [], isMore = true;
                Object.keys(data.val()).forEach(key => {
                    jojk = data.val()[key];
                    jojks.push({key:key,jojk:jojk});
                });
                jojks.sort(_this.compare);
                if (jojks.length < preload) {
                    isMore = false;
                }
                _this.setState({
                    jojks: jojks,
                    loaded: true,
                    loadMore: isMore
                });
             });

             jojksRef.on('child_added', function(data) {
                 if(_this.state.loaded) {
                    _this.setState({jojks: [...[{key: data.key,jojk:data.val()}], ..._this.state.jojks]});
                 }
             });

             let checkRef = firebase.database().ref('jojks/' + location.country + '/' + location.city).limitToLast(1);
             checkRef.once('value').then(data => {
                 if (!data.val()) {
                    _this.setState({loaded: true});
                 }
             });
        }
    }

    componentWillUnmount() {
        if(this.state.jojksRef) {
            this.state.jojksRef.off();
            this.setState({listening: false});
        }
    }

    render() {
        return(
            <div className="Billboard">
                <h1>{
                        this.props.userLocation ? 
                            this.props.userLocation.city === this.state.city ? 
                                <span onClick={this.props.refreshLocation}><LocationIcon className="Icon"/></span>
                            : null
                        : null
                    }
                    {
                        this.state.city === 'Unknown'?
                            <span onClick={this.props.refreshLocation}><LocationIcon className="Icon"/></span>
                        : null
                    }
                    {this.state.city} 
                </h1>
                { !this.props.noLocation && this.state.city === 'Unknown'?
                    <Loading text="Checking location"/>
                    :null
                }
                <ul>
                    {
                        this.state.city === 'Unknown' && this.props.noLocation ?
                        <div>Couldn't get your position :(</div>
                        : null
                    }
                    { this.state.jojks.length < 1 && this.state.loaded && this.state.city !== 'Unknown' ?
                        <div>Nothing to show, listen to a track to share it with your region.</div>
                        :
                        this.state.jojks.map((item) => (
                            <BillboardListItem key={item.key} jojk={item.jojk} token={this.props.token} />
                        ))
                    }
                </ul>
                { !this.state.loaded && this.state.city !== 'Unknown'?
                    <Loading text="Loading tracks"/>
                    :null
                }
                { this.state.loadMore ? 
                    <div className="Load-more">
                        <InfoButton text="Load more" onClick={this.loadMoreTracks} />
                    </div>
                :null }
            </div>
        );
    }
}

export default Billboard;
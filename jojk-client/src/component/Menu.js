import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from "firebase";
import config from './../../config.json';

import LogoutIcon from 'mdi-react/LogoutIcon';
import DownArrow from 'mdi-react/ArrowDownDropCircleOutlineIcon';

import './../styles/Menu.css';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded_cities: false,
            expanded_country: 'Sweden',
            cities: undefined,
        };

        if (firebase.apps.length === 0) {
            firebase.initializeApp(config.firebase);
        }

        this.expandCities = this.expandCities.bind(this);
        this.toggleExpanded = this.toggleExpanded.bind(this);
    }

    componentWillMount() {
        this.getCities();
    }

    getCities() {
        var _this = this;
        var cities = firebase.database().ref('cities').orderByChild('key');
        //this.setState({jojksRef: jojksRef});

        cities.once('value', function(data) {
            console.log(data.val());
            _this.setState({cities: data.val()});
            //_this.setState({jojks: [{key: data.key,jojk:data.val()}].concat(_this.state.jojks)});  
        });
    }

    makeCitySubMenuDom() {
        var _this = this;
        var test = (
            Object.keys(this.state.cities).map(country => (
                <ul className={'City-menu' + (_this.state.expanded_country === country ? ' Expanded' : '')} key={country}>
                    <li onClick={this.toggleExpanded}>{country}</li>
                    {Object.keys(_this.state.cities[country]).map(city => (
                        <Link key={_this.state.cities[country][city].key} to={'/' + country + '/' + _this.state.cities[country][city].key}>
                            <li className='City'>{_this.state.cities[country][city].key}</li>
                        </Link>
                    ))}
                </ul>
            ))
        );
        return test;
    }

    toggleExpanded(event) {
        var country = event.target.textContent;
        if (this.state.expanded_country === country) {
            this.setState({expanded_country: undefined});
        } else {
            this.setState({expanded_country: country});
        }
    }

    expandCities() {
        if(this.state.expanded_cities) {
            this.setState({expanded_cities: false});
        } else {
            this.setState({expanded_cities: true});
        }
    }

    render() {

        return(
            <div className="Menu">
                <ul onClick={this.props.closeSidebar}>
                    <Link to="/profile">
                        <li>Profile</li>
                    </Link>
                    <Link to="/">
                        <li>My City</li>
                    </Link>
                    <li onClick={this.expandCities}>Other Cities <DownArrow className={'ExpandableIcon' + (this.state.expanded_cities ? ' Expanded' : '')}/></li>

                    <ul className={'Sub-menu' + (this.state.expanded_cities ? ' Expanded' : '')}>
                    {this.state.cities ? 
                        this.makeCitySubMenuDom() : ''}
                     </ul>
                </ul>
                <div className="Quick-buttons">
                    <Link to="/logout"><div><LogoutIcon className="Icon"/></div></Link>
                </div>
            </div>
        );
    }
}

export default Menu;
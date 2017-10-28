import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from "firebase";
import config from './../../config.json';

import LogoutIcon from 'mdi-react/LogoutIcon';
import DownArrow from 'mdi-react/MenuDownIcon';
import NewJojkHighlight from './NewJojkHighlight';

import './../styles/Menu.css';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded_regions: false,
            expanded_country: undefined,
            countries: []
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

        cities.on('child_added', function(data) {
            _this.setState({countries: [{key: data.key,cities:data.val()}].concat(_this.state.countries)});  
        });
        cities.on('child_changed', function(data) {
            var arr = _this.state.countries.slice(0);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].key === data.key) {
                    arr[i].cities = data.val();
                }
            }

            _this.setState({countries: arr});  
        });

    }

    makeCitySubMenuDom() {
        var _this = this;
        var dom = (
            this.state.countries.map(country => (
                <ul className={'City-menu' + 
                    (_this.state.expanded_country === country.key ? ' Expanded' : '')} 
                    key={country.key}>
                    <li onClick={this.toggleExpanded}>
                        {country.key}
                        <DownArrow className={'ExpandableIcon' + 
                            (this.state.expanded_country === country.key ? ' Expanded' : '')}/>
                    </li>
                    {Object.keys(country.cities).map(city => (
                        <Link key={city} to={'/region/' + country.key + '/' + city}>
                            <li onClick={this.props.closeSidebar} className="City">
                                {city}
                                <NewJojkHighlight country={country.key} city={city}/>
                            </li>
                        </Link>
                    ))}
                </ul>
            ))
        );
        return dom;
    }

    toggleExpanded(event) {
        let target = event.target;
        while (target.tagName !== 'LI') {
            target = target.parentElement;
        }
        var country = target.textContent;
        if (this.state.expanded_country === country) {
            this.setState({expanded_country: undefined});
        } else {
            this.setState({expanded_country: country});
        }
    }

    expandCities() {
        this.setState({expanded_regions: !this.state.expanded_regions});
    }

    render() {
        return(
            <div className="Menu">
                <div className="Quick-buttons">
                    <Link to="/logout" title="logout"><LogoutIcon className="Icon"/></Link>
                </div>
                <ul>
                    <Link to={'/profile/' + this.props.user} onClick={this.props.closeSidebar}>
                        <li>My Profile</li>
                    </Link>
                    <Link to="/" onClick={this.props.closeSidebar}>
                        <li>My Region</li>
                    </Link>
                    <li onClick={this.expandCities}>
                        All Regions
                        <DownArrow className={'ExpandableIcon' + 
                            (this.state.expanded_regions ? ' Expanded' : '')}/>
                    </li>

                    <ul className={'Sub-menu' + (this.state.expanded_regions ? ' Expanded' : '')}>
                    {this.state.countries ? 
                        this.makeCitySubMenuDom() : ''}
                     </ul>
                </ul>
            </div>
        );
    }
}

export default Menu;
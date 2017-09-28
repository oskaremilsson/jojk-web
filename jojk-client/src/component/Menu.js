import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LogoutIcon from 'mdi-react/LogoutIcon';

import './../styles/Menu.css';

class Menu extends Component {
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
                </ul>
                <div className="Quick-buttons">
                    <Link to="/logout"><div><LogoutIcon className="Icon"/></div></Link>
                </div>
            </div>
        );
    }
}

export default Menu;
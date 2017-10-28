import React, { Component } from 'react';

import './../styles/InfoButton.css';

class InfoButton extends Component {
    render() {
        return (
            <div className="InfoButton" onClick={this.props.onClick}>
                { this.props.icon ?
                    <span className="Icon">
                        {this.props.icon}
                    </span>
                : null}
                {this.props.text}
            </div>
        );
    }
}

export default InfoButton;

import React, { Component } from 'react';

import './../styles/Popup.css';

class Popup extends Component {
    render() {
        return (
            <div className='Popup'>
                <div className={'Popup_inner' + (this.props.type ? ' ' + this.props.type : '')}>
                    <h1>{this.props.title}</h1>
                    <p>{this.props.text}</p>
                    <div className='Button-wrapper'>
                        <div className='Closebutton' 
                            onClick={this.props.closePopup}>
                            {this.props.buttonText}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup;

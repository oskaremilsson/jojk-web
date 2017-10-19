import React, { Component } from 'react';

import './../styles/Loading.css';

import LoadingIcon from 'mdi-react/LoadingIcon';

class Loading extends Component {
    render() {
        return (
            <div className="Loading">
                <LoadingIcon className="Icon"/>
                Loading
            </div>
        );
    }
}

export default Loading;

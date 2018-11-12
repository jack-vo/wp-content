// External Dependencies
import React, {Component, Fragment} from 'react';

// Internal Dependencies
import './style.css';


class Finder extends Component {
    static slug = 'gofi_finder';

    render() {
        return (
            <Fragment>
                {this.props.content()}
            </Fragment>
        );
    }
}

export default Finder;

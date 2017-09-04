import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class App extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="absolute-Center is-responsive">
                        {this.props.children}
                    </div>
                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);

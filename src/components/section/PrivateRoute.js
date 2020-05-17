import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import store from "../../store";
// import PropTypes from 'prop-types';

class PrivateRoute extends Component {

    // static propTypes = {
    //     component: PropTypes.func.isRequired,
    //     path: PropTypes.string.isRequired
    // }

    render() {
        const {component: Component, ...restProps} = this.props;
        return <Route {...restProps} render={(props) => (


                store.getState().user.isAuthenticated ? (
                    <Component {...props}/>
                ) : (
                    <Redirect to={{ pathname : '/' , state : {from : props.location} }} />
                )
            )}/>
    }
}

export default PrivateRoute;

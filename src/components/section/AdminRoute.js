import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import store from "../../store";

class AdminRoute extends Component {

    render() {
        const {component: Component, ...restProps} = this.props;
        const {user} = store.getState().user;
        return <Route {...restProps} render={(props) => (

            user && user.admin ? (
                    <Component {...props}/>
                ) : (
                    <Redirect to={{ pathname : "/" , state : {from : props.location} }} />
                )
            )}/>
    }
}

export default AdminRoute;

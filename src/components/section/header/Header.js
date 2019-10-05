import React, {Component} from "react";
import {Link, withRouter} from 'react-router-dom'
import NavItem from "./NavItem";
import {removeUser, setIsAuthenticated, setUser} from "../../../actions/userAction";
import {
    API_ROUTE,
    APP_TOKEN_NAME,
    ROUTE_CATEGORIES,
    ROUTE_HOME,
    ROUTE_LOGIN,
    ROUTE_REGISTER
} from "../../../config/config";
import store from "../../../store";
import Axios from "axios";

class Header extends Component {

    constructor(props) {
        super(props);
        store.dispatch(setIsAuthenticated(true));
        const api_token = localStorage.getItem(APP_TOKEN_NAME);
        if (api_token != null) {
            Axios.get(`${API_ROUTE}/profile?api_token=${api_token}`,
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                store.dispatch(setUser(response.data.data));
                this.forceUpdate();
            }).catch((error) => {
                if (error.response.status === 401) {
                    localStorage.removeItem(APP_TOKEN_NAME);
                    store.dispatch(removeUser());
                    store.dispatch(setIsAuthenticated(false));
                    this.props.history.push(ROUTE_LOGIN);
                }
            })
        } else {
            store.dispatch(removeUser());
            store.dispatch(setIsAuthenticated(false))
        }
    }

    logOut = () => {
        localStorage.removeItem(APP_TOKEN_NAME);
        store.dispatch(removeUser());
        store.dispatch(setIsAuthenticated(false));
        this.props.history.push(ROUTE_HOME);
    };

    render() {
        const userState = store.getState().user;
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/"><h4 className="text-success">راکت</h4></Link>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="mr-auto navbar-nav">
                            <NavItem activeOnlyWhenExact={true} to={ROUTE_HOME}>صفحه اصلی</NavItem>
                            <NavItem to={ROUTE_CATEGORIES}>دسته بندی ها</NavItem>
                            <NavItem to="/about">درباره ما</NavItem>
                        </ul>
                        <div className="my-2 my-lg-0">
                            {
                                userState.isAuthenticated
                                    ? (
                                        <div>
                                            {userState.user.admin
                                                ?
                                                <Link className="btn btn-info ml-2" to="/admin/articles">داشبورد</Link>
                                                :
                                                ""
                                            }
                                            <Link className="btn btn-success ml-2" to="/user-panel">پنل کاربری</Link>
                                            <button className="btn btn-danger" onClick={this.logOut}>خروج</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Link className="btn btn-success ml-2" to={ROUTE_LOGIN}>ورود</Link>
                                            <Link className="btn btn-primary" to={ROUTE_REGISTER}>ثبت نام</Link>
                                        </div>
                                    )
                            }

                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default withRouter(Header);

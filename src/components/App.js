import React, {Component} from "react";
import Login from "./page/auth/Login";
import NotFound from "./page/home/NotFound";
import {Switch , Route , BrowserRouter} from "react-router-dom"
import Register from "./page/auth/Register";
import "../styles/bootstrap-rtl.min.css"
import "../styles/Cummon.css"
import Home from "./page/home/Home";
import Categories from "./page/home/categories/Categories";
import Category from "./page/home/categories/Category";
import Article from "./page/home/articles/Article";
import Header from "./section/header/Header";
import {
    ROUTE_ARTICLE, ROUTE_ARTICLES,
    ROUTE_CATEGORIES,
    ROUTE_CATEGORY,
    ROUTE_HOME,
    ROUTE_LOGIN, ROUTE_PRODUCTS,
    ROUTE_REGISTER, ROUTE_TAGS, ROUTE_USER_PANEL
} from "../config/config";
import PrivateRoute from "./section/PrivateRoute";
import UserPanel from "./page/home/UserPanel";
import Dashboard from "./page/admin/Dashboard";
import Tag from "./page/home/tags/Tag";
import Articles from "./page/home/articles/Articles";

class App extends Component {

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Header/>
                    <Switch>
                        <Route exact path={ROUTE_HOME} component={Home} />
                        <Route path={ROUTE_ARTICLE} component={Article}/>
                        <Route path={ROUTE_ARTICLES} component={Articles}/>
                        <Route exact path={ROUTE_LOGIN} component={Login} />
                        <Route exact path={ROUTE_REGISTER} component={Register} />
                        <Route exact path={ROUTE_CATEGORIES} component={Categories} />
                        <Route exact path={ROUTE_CATEGORY} component={Category} />
                        <Route exact path={ROUTE_TAGS} component={Tag} />

                        {/*Private Route*/}
                        <PrivateRoute exact path={ROUTE_USER_PANEL} component={UserPanel} />

                        {/*Admin Route*/}
                        <Route path="/admin" render={props => <Dashboard {...props} />} />

                        <Route component={NotFound} />
                    </Switch>
                </BrowserRouter>

            </div>
        )
    }
}
export default App;



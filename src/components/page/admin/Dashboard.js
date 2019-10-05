import React, {Component} from "react";
import "../../../styles/bootstrap-rtl.min.css";
import "../../../styles/admin.css";
import {Link, Route, Switch} from "react-router-dom"
import Articles from "./Articles";
import Categories from "./Categories";
import SectionEditArticle from "./section/articles/SectionEditArticle";
import SectionEditCategory from "./section/categories/SectionEditCategory";
import Tags from "./Tags";
import SectionEditTag from "./section/tags/SectionEditTag";
import Users from "./Users";
import SectionEditUser from "./section/users/SectionEditUser";
import SectionUser from "./section/users/SectionUsers";
import Roles from "./Roles";
import Permissions from "./Permissions";
import SectionEditPermissions from "./section/permissions/SectionEditPermissions";
import SectionEditRole from "./section/roles/SectionEditRole";
import LevelManager from "./LevelManager";
import SectionEditLevel from "./section/levels/SectionEditLevel";

class Dashboard extends Component {

    /* componentDidMount(){
         if (this.props.location.pathname === "/admin"){
             this.props.history.push("/admin/articles")
         }
     }*/

    render() {

        return (
            <div className="header-margin">
                <div className="container-fluid">
                    <div className="row rtl">

                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                            <Switch>
                                <Route path="/admin/articles" component={Articles}/>
                                <Route path="/admin/article/edit/:slug" component={SectionEditArticle}/>
                                <Route path="/admin/categories" component={Categories}/>
                                <Route path="/admin/category/edit/" component={SectionEditCategory}/>
                                <Route path="/admin/tags" component={Tags}/>
                                <Route path="/admin/tag/edit/" component={SectionEditTag}/>
                                <Route path="/admin/users" component={Users}/>
                                <Route path="/admin/user/edit/" component={SectionEditUser}/>
                                <Route path="/admin/roles" component={Roles}/>
                                <Route path="/admin/role/edit" component={SectionEditRole}/>
                                <Route path="/admin/permissions" component={Permissions}/>
                                <Route path="/admin/permission/edit" component={SectionEditPermissions}/>
                                <Route path="/admin/levels" component={LevelManager}/>
                                <Route path="/admin/level/edit" component={SectionEditLevel}/>
                            </Switch>
                        </div>

                        <div className="col-sm-3 col-md-2 sidebar">
                            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                                <div className="sidebar-sticky">

                                    <ul style={{listStyleType: "none", padding: 0}}>
                                        <li>
                                            <Link to="/admin/articles">مقاله ها</Link>
                                        </li>
                                        <li>
                                            <Link to="/admin/categories">دسته بندی ها</Link>
                                        </li>
                                        <li>
                                            <Link to="/admin/tags">تگ ها</Link>
                                        </li>
                                        <li>
                                            <Link to="/admin/users">کاربران</Link>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
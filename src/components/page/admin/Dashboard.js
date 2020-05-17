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
import Roles from "./Roles";
import Permissions from "./Permissions";
import SectionEditPermissions from "./section/permissions/SectionEditPermissions";
import SectionEditRole from "./section/roles/SectionEditRole";
import LevelManager from "./LevelManager";
import SectionEditLevel from "./section/levels/SectionEditLevel";
import {isAllowed} from "../../../config/auth";
import Comments from "./Comments";
import SectionAnswerComment from "./section/comments/SectionAnswerComment";

class Dashboard extends Component {

    componentDidMount() {
        if (this.props.location.pathname === "/admin") {
            this.props.history.push("/admin/articles")
        }
    }

    render() {
        return (
            <div className="header-margin">
                <div className="container-fluid">
                    <div className="row rtl">
                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                            <Switch>
                                <Route path="/admin/articles" component={Articles}/>
                                {isAllowed("Update-Article") &&
                                <Route path="/admin/article/edit/:slug" component={SectionEditArticle}/>
                                }


                                {isAllowed("All-Categories") &&
                                <Route path="/admin/categories" component={Categories}/>
                                }
                                {isAllowed("All-Categories") &&
                                <Route path="/admin/category/edit/" component={SectionEditCategory}/>
                                }

                                {isAllowed("All-Tags") &&
                                <Route path="/admin/tags" component={Tags}/>
                                }
                                {isAllowed("All-Tags") &&
                                <Route path="/admin/tag/edit/" component={SectionEditTag}/>
                                }

                                {isAllowed("Show-Users") &&
                                <Route path="/admin/users" component={Users}/>
                                }
                                {isAllowed("Update-User") &&
                                <Route path="/admin/user/edit/" component={SectionEditUser}/>
                                }

                                {isAllowed("Show-Roles") &&
                                <Route path="/admin/roles" component={Roles}/>
                                }
                                {isAllowed("Update-Role") &&
                                <Route path="/admin/role/edit" component={SectionEditRole}/>
                                }

                                {isAllowed("Show-Permissions") &&
                                <Route path="/admin/permissions" component={Permissions}/>
                                }
                                {isAllowed("Update-Permission") &&
                                <Route path="/admin/permission/edit" component={SectionEditPermissions}/>
                                }

                                {isAllowed("Show-Levels") &&
                                <Route path="/admin/levels" component={LevelManager}/>
                                }
                                {isAllowed("Update-Level") &&
                                <Route path="/admin/level/edit" component={SectionEditLevel}/>
                                }

                                {isAllowed("All-Comments") &&
                                    <Route path="/admin/comments" component={Comments}/>
                                }
                                {isAllowed("All-Comments") &&
                                    <Route path="/admin/comment/answer" component={SectionAnswerComment}/>
                                }
                            </Switch>
                        </div>

                        <div className="col-sm-3 col-md-2 sidebar">
                            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                                <div className="sidebar-sticky">

                                    <ul style={{listStyleType: "none", padding: 0}}>
                                        <li>
                                            <Link to="/admin/articles">مقاله ها</Link>
                                        </li>

                                        {isAllowed("All-Categories") &&
                                        <li>
                                            <Link to="/admin/categories">دسته بندی ها</Link>
                                        </li>
                                        }

                                        {isAllowed("All-Tags") &&
                                        <li>
                                            <Link to="/admin/tags">تگ ها</Link>
                                        </li>
                                        }
                                        {isAllowed("Show-Users") &&
                                        <li>
                                            <Link to="/admin/users">کاربران</Link>
                                        </li>
                                        }
                                        {isAllowed("All-Comments") &&
                                        <li>
                                            <Link to="/admin/comments">نظرات سایت</Link>
                                        </li>
                                        }
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
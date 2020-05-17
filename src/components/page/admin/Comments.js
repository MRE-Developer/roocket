import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import SectionComments from "./section/comments/SectionComments";
import SectionUnverifiedComments from "./section/comments/SectionUnverifiedComments";

class Comments extends Component {

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/comments">نظرات</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">

                            <li className="nav-item active">
                                <Link className="nav-link text-primary" to="/admin/comments/unVerified">در انتظار
                                    تایید</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <Switch>
                    <Route exact path="/admin/comments" render={() => <SectionComments/>}/>
                    <Route path="/admin/comments/unVerified" component={SectionUnverifiedComments}/>
                </Switch>
            </div>
        )
    }
}

export default Comments;

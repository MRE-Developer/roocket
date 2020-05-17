import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import SectionRoles from "./section/roles/SectionRoles";
import SectionAddRole from "./section/roles/SectionAddRole";
import {isAllowed} from "../../../config/auth";

class Roles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: ""
        }
    }

    handleSearch = (e) => {
        this.setState({search: e.target.value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.roles.componentDidMount()
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/roles">مقام ها</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">
                            {isAllowed("Create-Role") &&
                            <li className="nav-item active">
                                <Link className="nav-link text-primary" to="/admin/roles/create">ثبت مقام جدید</Link>
                            </li>
                            }
                        </ul>

                        <div className="btn-group " role="group" aria-label="Basic example">
                            {isAllowed("Show-Permissions") &&
                            <Link className="btn btn-info" to="/admin/permissions">سطوح دسترسی</Link>
                            }

                            {isAllowed("Show-Users") &&
                            <Link className="btn btn-warning" to="/admin/users" >کاربران</Link>
                            }
                        </div>

                        <form className="form-inline">
                            <div className="col rtl ">
                                <input type="text"
                                       className="form-control"
                                       onChange={this.handleSearch}
                                       placeholder="متن جستجو"/>
                            </div>
                            <div className="col rtl p-0">
                                <button className="btn btn-success" onClick={this.handleSubmit}>جستجو</button>
                            </div>
                        </form>
                    </div>
                </nav>

                <Switch>
                    {isAllowed("Show-Roles") &&
                    <Route exact path="/admin/roles"
                           render={() => <SectionRoles search={this.state.search} onRef={ref => (this.roles = ref)}/>}/>
                    }
                    {isAllowed("Create-Permission") &&
                    <Route exact path="/admin/roles/create" component={SectionAddRole}/>
                    }
                </Switch>
            </div>
        )
    }
}

export default Roles;

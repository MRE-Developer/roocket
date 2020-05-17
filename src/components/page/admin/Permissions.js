import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import SectionPermissions from "./section/permissions/SectionPermissions";
import SectionAddPermissions from "./section/permissions/SectionAddPermissions";
import {isAllowed} from "../../../config/auth";

class Permissions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: ""
        }
    }

    handleSearch = (e) => {
        this.setState({search : e.target.value});
    };

    handleSubmit= (e) => {
        e.preventDefault();
        this.permissions.componentDidMount()
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/permissions">دسترسی ها</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                {isAllowed("Create-Permission") &&
                                <Link className="nav-link text-primary" to="/admin/permissions/create" >ثبت دسترسی جدید</Link>
                                }
                            </li>
                        </ul>

                        <div className="btn-group " role="group" aria-label="Basic example">
                            {isAllowed("Show-Roles") &&
                            <Link className="btn btn-info" to="/admin/roles" >مقام ها</Link>
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
                    {isAllowed("Show-Permissions") &&
                    <Route exact path="/admin/permissions" render={() => <SectionPermissions search={this.state.search} onRef={ref => (this.permissions = ref)}/>} />
                    }

                    {isAllowed("Create-Permission") &&
                    <Route exact path="/admin/permissions/create" component={SectionAddPermissions}/>
                    }
                </Switch>
            </div>
        )
    }
}

export default Permissions;

import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import SectionUsers from "./section/users/SectionUsers";
import SectionAddUser from "./section/users/SectionAddUser";

class Users extends Component {

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
        this.users.componentDidMount()
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/tags">کاربران</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link text-primary" to="/admin/users/create" >ثبت نام کاربر جدید</Link>
                            </li>
                        </ul>

                        <div className="btn-group " role="group" aria-label="Basic example">
                            <Link className="btn btn-warning" to="/admin/roles" >مقام ها</Link>
                            <Link className="btn btn-info" to="/admin/levels" >کاربران مدیریت</Link>
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
                    <Route exact path="/admin/users" render={() => <SectionUsers search={this.state.search} onRef={ref => (this.users = ref)}/>} />
                    <Route exact path="/admin/users/create" component={SectionAddUser}/>
                </Switch>

            </div>
        )
    }
}

export default Users;

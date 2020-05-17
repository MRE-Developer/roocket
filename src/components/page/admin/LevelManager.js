import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import SectionLevels from "./section/levels/SectionLevels";
import SectionAddLevel from "./section/levels/SectionAddLevel";
import {isAllowed} from "../../../config/auth";

class LevelManager extends Component {

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
        this.levels.componentDidMount()
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/levels">کاربران مدیریت</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                {isAllowed("Create-Level") &&
                                <Link className="nav-link text-primary" to="/admin/levels/create" >ثبت مقام برای کاربر</Link>
                                }
                            </li>
                        </ul>

                        <div className="btn-group " role="group" aria-label="Basic example">
                            {isAllowed("Show-Roles") &&
                            <Link className="btn btn-warning" to="/admin/roles" >مقام ها</Link>
                            }

                            {isAllowed("Show-Users") &&
                            <Link className="btn btn-info" to="/admin/users" >کاربران</Link>
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
                    {isAllowed("Show-Levels") &&
                    <Route exact path="/admin/levels" render={() => <SectionLevels search={this.state.search} onRef={ref => (this.levels = ref)}/>} />
                    }

                    {isAllowed("Create-Level") &&
                    <Route exact path="/admin/levels/create" component={SectionAddLevel}/>
                    }
                </Switch>

            </div>
        )
    }
}

export default LevelManager;

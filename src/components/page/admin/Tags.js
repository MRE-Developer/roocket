import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import SectionTags from "./section/tags/SectionTags";
import SectionAddTag from "./section/tags/SectionAddTag";
import {isAllowed} from "../../../config/auth";

class Tags extends Component {

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
        this.tags.componentDidMount()
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/tags">تگ ها</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link text-primary" to="/admin/tags/create" >اضافه کردن تگ</Link>
                            </li>
                        </ul>

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
                    <Route exact path="/admin/tags" render={() => <SectionTags search={this.state.search} onRef={ref => (this.tags = ref)}/>} />

                    {isAllowed("All-Tags") &&
                    <Route exact path="/admin/tags/create" component={SectionAddTag}/>
                    }
                    </Switch>

            </div>
        )
    }
}

export default Tags;

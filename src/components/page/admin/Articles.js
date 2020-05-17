import React, {Component} from "react";
import SectionArticles from "./section/articles/SectionArticles";
import SectionAddArticle from "./section/articles/SectionAddArticle";
import {Link, Route, Switch} from "react-router-dom";
import SectionUnVerifiedArticles from "./section/articles/SectionUnVerifiedArticles";
import {isAllowed} from "../../../config/auth";

class Articles extends Component {

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
        this.articles.componentDidMount()
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/articles">مقاله ها</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">

                            {isAllowed("Verify-Articles") &&
                            <li className="nav-item active">
                                <Link className="nav-link text-primary" to="/admin/articles/unVerified">در انتظار
                                    تایید</Link>
                            </li>
                            }

                            {isAllowed("Create-Article") &&
                            <li className="nav-item active">
                                <Link className="nav-link text-primary" to="/admin/articles/create">نوشتن مقاله</Link>
                            </li>
                            }
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
                    <Route exact path="/admin/articles" render={() => <SectionArticles search={this.state.search} onRef={ref => (this.articles = ref)}/>}/>
                    {isAllowed("Verify-Articles") &&
                        <Route exact path="/admin/articles/unVerified" component={SectionUnVerifiedArticles}/>
                    }
                    {isAllowed("Create-Article") &&
                        <Route exact path="/admin/articles/create" component={SectionAddArticle}/>
                    }
                </Switch>
            </div>
        )
    }
}

export default Articles;

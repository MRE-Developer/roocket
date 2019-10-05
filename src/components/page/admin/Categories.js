import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import SectionCategories from "./section/categories/SectionCategories";
import SectionAddCategory from "./section/categories/SectionAddCategory";
import SectionArticles from "./section/articles/SectionArticles";

class Categories extends Component {


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
        this.categories.componentDidMount()
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                    <Link className="navbar-brand" to="/admin/categories">دسته بندی ها</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link text-primary" to="/admin/categories/create" >اضافه کردن دسته بندی</Link>
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
                    <Route exact path="/admin/categories" render={() => <SectionCategories search={this.state.search} onRef={ref => (this.categories = ref)}/>} />
                    <Route exact path="/admin/categories/create" component={SectionAddCategory}/>
                </Switch>

            </div>
        )
    }
}


export default Categories;

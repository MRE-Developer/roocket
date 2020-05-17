import React, {Component} from "react";
import Article from "../../../section/Article";
import {API_ROUTE, SERVER_ERROR} from "../../../../config/config";
import swal from "sweetalert";
import Axios from "axios";
import Select from "react-select";
import Spinner from "../../../section/Spinner";

class Articles extends Component {

    state = {
        articles: null,
        categories: [],
        category: "all",
        orderBy: "DESC",
        search: ""
    };

    componentDidMount() {
        const {search, category, orderBy} = this.state;
        Axios.get(API_ROUTE + `/articles?search=${search}&orderBy=${orderBy}&category=${category}`)
            .then((response) => {
                const data = response.data;
                if (data.status === "success") {
                    const categories = data.data.categories.map((category) => (
                        {value: `${category.slug}`, label: `${category.name}`}
                    ));
                    categories.unshift({value: "all", label: "همه دسته بندی ها"});

                    this.setState({articles: data.data.articles.data, categories});
                } else {
                    swal("عملیات نا موفق!", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });
    };

    handleSelect = (optionSelected, e) => {
        this.setState({[e.name]: optionSelected.value});
    };

    handleSearch = e => {
        this.setState({search: e.target.value});
    };

    handleSubmit = e => {
        e.preventDefault();
        this.componentDidMount();
    };

    render() {
        const {categories, articles} = this.state;

        return (
            <div className="container">
                <div className="p-2 rtl header-margin">
                    <h1 className="text-primary">بخش مقالات</h1>
                </div>

                <form>
                    <div className="form-row mb-3">
                        <div className="col-3 rtl">
                            <Select
                                onChange={this.handleSelect}
                                name="orderBy"
                                options={[
                                    {value: "DESC", label: "جدید ترین مقالات"},
                                    {value: "ASC", label: "قدیمی ترین مقالات"},
                                    {value: "popular", label: "پربازدیدترین مقالات"},
                                ]}
                                defaultValue={{value: `latest`, label: `جدید ترین ها`}}
                            />
                        </div>
                        <div className="col-3 rtl">
                            <Select
                                onChange={this.handleSelect}
                                name="category"
                                options={categories}
                                defaultValue={{value: "all", label: "همه دسته بندی ها"}}
                            />
                        </div>
                        <div className="col rtl">
                            <input type="text"
                                   name="search"
                                   className="form-control"
                                   onChange={this.handleSearch}
                                   placeholder="متن جستجو"/>
                        </div>
                        <div className="col-2 rtl">
                            <button className="btn btn-success btn-block" onClick={this.handleSubmit}>فیلتر</button>
                        </div>
                    </div>
                </form>
                {articles ?
                    <div className="row rtl">
                        {articles.map((article, index) => <Article article={article} key={index}/>)}
                    </div>
                    : ""
                }
            </div>

        )
    }
}

export default Articles;

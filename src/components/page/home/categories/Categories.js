import React, {Component} from "react";
import Axios from "axios";
import {API_ROUTE} from "../../../../config/config";
import {Link} from "react-router-dom";

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        }
    }

    componentDidMount() {
        Axios.get(API_ROUTE + "/categories")
            .then((response) => {
                this.setState({categories: response.data.data.data});
            })
            .catch((error) => {
                console.log("error" + error.toString());
            });
    };

    render() {

        return (
            <div className="container header-margin">

                <div className="rtl"><h2><span className="badge badge-secondary p-3">دسته بندی ها</span></h2></div>
                <div className="row rtl">
                    {this.state.categories.map((category, index) =>
                        <div key={index}>
                            <div className="card ml-3">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{category.name}</h5>
                                        <Link to={`/category/${category.slug}`} className="btn btn-primary">محصولات</Link>
                                    </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        )
    }
}

export default Categories;

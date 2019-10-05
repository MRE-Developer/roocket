import React, {Component} from "react";
import Axios from "axios";
import {API_ROUTE} from "../../../../config/config";
import Article from "../../../section/Article";

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category: null,
        }
    }

    componentDidMount() {
        const {params} = this.props.match;
        Axios.get(API_ROUTE + "/category/" + params.slug)
            .then((response) => {
                this.setState({category: response.data.data});
            })
            .catch((error) => {
                console.log("error" + error.toString());
            });
    };

    render() {

        const {category} = this.state;
        return (
            <div>
                {category != null ?
                    <div className="container header-margin">
                        <div className="rtl">
                            <h2>
                                <span className="badge badge-secondary p-3">
                                    دسته بندی :
                                     <span className="text-success"> {category.name}</span>
                                </span>
                            </h2>
                        </div>
                        <div className="row rtl">
                            {category.articles.map((article, index) => <Article article={article} key={index}/>)}
                        </div>

                    </div>
                    :
                    ""
                }
            </div>
        )
    }
}

export default Categories;

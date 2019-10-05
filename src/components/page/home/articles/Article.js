import React, {Component} from "react";
import axios from 'axios';
import {API_ROUTE} from "../../../../config/config";
import "../../../../styles/Cummon.css"
import {Link} from "react-router-dom";


class Article extends Component {

    constructor(props) {
        super(props);
        this.state = {
            article: null
        }
    }

    componentDidMount() {
        const {params} = this.props.match;
        axios.get(API_ROUTE + /article/ + params.slug)
            .then(response => {
                this.setState({
                    article: response.data.data
                })
            })
            .catch(error => console.log(error))
    }

    render() {
        const {article} = this.state;

        return (
            <div className="container">
                {article != null ?
                    <div className="header-margin rtl">
                        <div className="text-center mt">
                            <img height="300px" width="500px" alt="100%x180"
                                 src={"http://localhost:8000" + article.image_url}
                                 data-holder-rendered="true"/>
                        </div>

                        <div className="row justify-content-between mt-3 align-items-center">
                            <div className="col">
                                <h2>عنوان مقاله : <span className="text-primary">{article.title}</span></h2>
                            </div>
                            <div className="col-4">
                                <h5>تالیف : <span className="text-primary">{article.user.name}</span></h5>
                            </div>
                        </div>

                        <hr/>
                        <div id="articleBody" dangerouslySetInnerHTML={{__html: `${article.body}`}} />
                        <div className="row justify-content-between">
                            <h5>دسته بندی :<Link to={`/category/${article.category.slug}`} className="text-primary"> {article.category.name}</Link></h5>
                            <h5>تگ ها :

                                {article.tags.map((tag , index) => <span key={index} className="badge badge-success ml-2 p-1">
                                    <Link to={`/tags/${tag.slug}`}>{tag.name}</Link>
                                </span>)}


                            </h5>

                        </div>
                    </div>
                    :
                    ""
                }
            </div>
        )
    }
}

export default Article;

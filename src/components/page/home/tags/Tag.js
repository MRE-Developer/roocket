import React, {Component} from "react";
import Axios from "axios";
import {API_ROUTE} from "../../../../config/config";
import Article from "../../../section/Article";

class Tag extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: null,
        }
    }

    componentDidMount() {
        const {params} = this.props.match;
        Axios.get(API_ROUTE + "/tag/" + params.slug)
            .then((response) => {
                this.setState({tag: response.data.data});
            })
            .catch((error) => {
                console.log("error" + error.toString());
            });
    };

    render() {

        const {tag} = this.state;
        return (
            <div>
                {tag != null ?
                    <div className="container header-margin">
                        <div className="rtl">
                            <h2>
                                <span className="badge badge-secondary p-3">
                                    تگ :
                                     <span className="text-success"> {tag.name}</span>
                                </span>
                            </h2>
                        </div>
                        <div className="row rtl">
                            {tag.articles.map((article, index) => <Article article={article} key={index}/>)}
                        </div>

                    </div>
                    :
                    ""
                }
            </div>
        )
    }
}

export default Tag;

import React, {Component} from "react";
import {Link} from "react-router-dom";

class Article extends Component {

    render() {
        const {article} = this.props;
        return (
            <div className="col-lg-3">
                <div className="card" style={{height: 430 ,marginBottom: 20}}>
                    <img className="card-img-top" data-src="holder.js/100px180/" alt="100%x180"
                         src={"http://localhost:8000" + article.image_url}
                         data-holder-rendered="true" height="200" width="280"/>
                    <div className="card-body pb-0" style={{overflow : "hidden"}}>
                        <Link to={`/article/${article.slug}`} className="text-info h5">{article.title}</Link>
                        <p className="mb-0"><small className="card-text">{article.description.substr(0,100)}...</small></p>
                    </div>
                    <div className="card-footer">
                        <Link to={"/article/" + article.slug} className="btn btn-primary">توضیحات بیشتر</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Article;

import React, {Component} from "react";
import Axios from "axios";
import Article from "../../section/Article";
import {API_ROUTE, ROUTE_ARTICLES, SERVER_ERROR} from "../../../config/config";
import swal from "sweetalert";
import {Link} from "react-router-dom";
import Spinner from "../../section/Spinner";

class Home extends Component {

    state = {
        articles: null,
    };

    componentDidMount() {
        Axios.get(API_ROUTE + "/lastArticles")
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({articles: response.data.data});
                } else {
                    swal("عملیات نا موفق!", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });
    };

    render() {
        const {articles} = this.state;

        return (
            <div className="container">
                <div className="jumbotron rtl header-margin">
                    <h1>مرجع آموزش کامپیوتر</h1>
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
                        چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی
                        مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه
                        درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری
                        را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.اساسا
                        مورد استفاده قرار گیرد..</p>
                </div>

                <div className="row justify-content-between mb-2">
                    <div className="col-4 float-right">
                        <h2><span className="badge badge-secondary p-3 float-right">آخرین مقالات</span></h2>
                    </div>
                    <div className="col-4 align-self-center">
                        <h5><Link to={ROUTE_ARTICLES}>مشاهده همه مقالات</Link></h5>
                    </div>
                </div>
                {articles
                    ?
                    <div className="row rtl">
                        {articles.map((article, index) => <Article article={article} key={index}/>)}
                    </div>
                    : ""
                }

            </div>
        )
    }
}

export default Home;

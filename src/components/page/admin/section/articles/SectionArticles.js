import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, YOU_SURE} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";
import {isAllowed} from "../../../../../config/auth";
import Spinner from "../../../../section/Spinner";

class SectionArticles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: null,
        };
        this.props.onRef(this);
    }

    // Get Articles
    componentDidMount() {
        Axios.get(API_ADMIN + `/articles?search=${this.props.search}&api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({articles: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    //  Delete Article
    onDelete = (article) => {
        swal("توجه!!!", YOU_SURE("مقاله"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/article/${article.slug}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
                    .then((response) => {
                        if (response.data.status === "success") {
                            swal("عملیات موفق", "مقاله به درستی حذف شد.", "success");
                            const articles = this.state.articles.filter((itemArticle) => article.id !== itemArticle.id);
                            this.setState({articles: articles});
                        }
                    })
                    .catch((error) => {
                        swal("عملیات ناموفق", "متاسفانه دسته بندی حذف نشد.", "error");
                    });
            }
        });
    };

    render() {
        const {articles} = this.state;
        return (
            <div>
                {articles ?
                    <table className="table table-striped ">
                        <thead>
                        <tr className="text-right">
                            <th scope="col">شماره</th>
                            <th scope="col">عنوان</th>
                            <th scope="col">دسته بندی</th>
                            <th scope="col">وضعیت</th>
                            <th scope="col">عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {articles.map((article, index) => (
                                <tr key={index} className="text-right">
                                    <th>{index + 1}</th>
                                    <td><Link to={"/article/" + article.slug}>{article.title}</Link></td>
                                    <td><Link to={"/category/" + article.category.slug}>{article.category.name}</Link>
                                    </td>
                                    <td>{article.published ? "تایید شده" : "در انتظار تایید"}</td>
                                    <td>

                                        {isAllowed("Update-Article") &&
                                        <Link className="btn btn-primary mr-2"
                                              to={"/admin/article/edit/" + article.slug}>ویرایش</Link>
                                        }
                                        {isAllowed("Delete-Article") &&
                                        <button className="btn btn-danger"
                                                onClick={() => this.onDelete(article)}>حذف</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : <Spinner/>}
            </div>
        )
    }
}

export default SectionArticles;

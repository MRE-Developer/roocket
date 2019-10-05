import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, API_ROUTE, APP_TOKEN_NAME} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";

class SectionCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
        this.props.onRef(this);
    }

    // Get Categories
    componentDidMount() {
        Axios.get(API_ROUTE + `/categories?search=${this.props.search}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({categories: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    //  Delete Categories
    onDelete = (category) => {
        Axios.post(API_ADMIN + `/category/${category.slug}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "دسته بندی به درستی حذف شد.", "success");
                    const categories = this.state.categories.filter((itemCategory) => category.id !== itemCategory.id);
                    this.setState({categories});
                }else {
                    swal("عملیات ناموفق", "متاسفانه دسته بندی حذف نشد.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "متاسفانه دسته بندی حذف نشد.", "error");
            });
    };

    render() {
        const {categories} = this.state;
        return (
            <div>
                <table className="table table-striped ">
                    <thead>
                    <tr className="text-right">
                        <th scope="col">شماره</th>
                        <th scope="col">عنوان</th>
                        <th scope="col">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        categories.map((category, index) => (
                            <tr key={index} className="text-right">
                                <th>{index + 1}</th>
                                <td><Link to={"/category/" + category.slug}>{category.name}</Link></td>
                                <td>
                                    {/*<Link className="btn btn-primary mr-2" to={"/admin/category/edit/" + category.slug}>ویرایش</Link>*/}
                                    <Link className="btn btn-primary mr-2"
                                          to={{
                                              pathname: '/admin/category/edit',
                                              state: {
                                                  category: category
                                              }
                                          }}
                                    >ویرایش</Link>
                                    <button className="btn btn-danger" onClick={() => this.onDelete(category)}>حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    }

                    </tbody>
                </table>
            </div>
        )
    }
}

export default SectionCategories;

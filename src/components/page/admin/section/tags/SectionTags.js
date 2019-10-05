import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";

class SectionTags extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
        };
        this.props.onRef(this);
    }

    // Get Tags
    componentDidMount() {
        Axios.get(API_ADMIN + `/tags?search=${this.props.search}&api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success"){
                    this.setState({tags: response.data.data.data});
                }else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    //  Delete Categories
    onDelete = (tag) => {
        Axios.post(API_ADMIN + `/tag/${tag.slug}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success"){
                    swal("عملیات موفق", "تگ به درستی حذف شد.", "success");
                    const tags = this.state.tags.filter((itemTag) => tag.id !== itemTag.id);
                    this.setState({tags});
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "متاسفانه تگ حذف نشد.", "error");
            });
    };

    render() {
        const {tags} = this.state;
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
                        tags.map((tag, index) => (
                            <tr key={index} className="text-right">
                                <th>{index + 1}</th>
                                <td><Link to={"/tags/" + tag.slug}>{tag.name}</Link></td>
                                <td>
                                    <Link className="btn btn-primary mr-2"
                                          to={{
                                              pathname: '/admin/tag/edit',
                                              state: {
                                                  tag: tag
                                              }
                                          }}
                                    >ویرایش</Link>
                                    <button className="btn btn-danger" onClick={() => this.onDelete(tag)}>حذف
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

export default SectionTags;

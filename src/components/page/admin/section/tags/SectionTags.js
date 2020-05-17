import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, YOU_SURE} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";
import Spinner from "../../../../section/Spinner";

class SectionTags extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: null,
        };
        this.props.onRef(this);
    }

    // Get Tags
    componentDidMount() {
        Axios.get(API_ADMIN + `/tags?search=${this.props.search}&api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({tags: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    //  Delete Categories
    onDelete = (tag) => {

        swal("توجه!!!", YOU_SURE("تگ"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/tag/${tag.slug}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
                    .then((response) => {
                        if (response.data.status === "success") {
                            swal("عملیات موفق", "تگ به درستی حذف شد.", "success");
                            const tags = this.state.tags.filter((itemTag) => tag.id !== itemTag.id);
                            this.setState({tags});
                        }
                    })
                    .catch((error) => {
                        swal("عملیات ناموفق", "متاسفانه تگ حذف نشد.", "error");
                    });
            }
        });

    };

    render() {
        const {tags} = this.state;
        return (
            <div>
                {tags ?
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
                    : <Spinner/>}
            </div>
        )
    }
}

export default SectionTags;

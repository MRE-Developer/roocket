import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR, YOU_SURE} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";
import {isAllowed} from "../../../../../config/auth";
import Spinner from "../../../../section/Spinner";

class SectionUnverifiedComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: null,
        };
    }

    // Get Comments
    componentDidMount() {
        Axios.get(API_ADMIN + `/comments/unverified?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({comments: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });
    };

    //  Delete Comments
    onDelete = (comment) => {
        swal("توجه!!!", YOU_SURE("نظر"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/comment/${comment.id}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
                    .then((response) => {
                        if (response.data.status === "success") {
                            swal("عملیات موفق", "کامنت به درستی حذف شد.", "success");
                            const comments = this.state.comments.filter((itemComment) => comment.id !== itemComment.id);
                            this.setState({comments});
                        }
                    })
                    .catch((error) => {
                        swal("عملیات ناموفق", "متاسفانه کامنت حذف نشد.", "error");
                    });
            }
        });
    };

    //  Verify Comments
    onVerify = (comment) => {
        Axios.post(API_ADMIN + `/comment/${comment.id}/verify?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "کامنت به درستی تایید شد.", "success");
                    const comments = this.state.comments.filter((itemComment) => comment.id !== itemComment.id);
                    this.setState({comments});
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });
    };

    render() {
        const {comments} = this.state;
        return (
            <div>
                {comments ?
                    <table className="table table-striped ">
                        <thead>
                        <tr className="text-right">
                            <th scope="col">شماره</th>
                            <th scope="col">کامنت</th>
                            <th scope="col">کاربر</th>
                            <th scope="col">قسمت</th>
                            <th scope="col">عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comments.map((comment, index) => (
                            <tr key={index} className="text-right">
                                <th>{index + 1}</th>
                                <div dangerouslySetInnerHTML={{__html: `${comment.comment}`}}/>
                                <td className="text-info align-middle">{comment.user.name}</td>
                                <td className="text-primary align-middle">{comment.commentable_type}</td>
                                <td>
                                    <button className="btn btn-danger"
                                            onClick={() => this.onDelete(comment)}>حذف
                                    </button>

                                    <button className="btn btn-success ml-2"
                                            onClick={() => this.onVerify(comment)}>تایید
                                    </button>

                                    <Link to={{
                                        pathname: '/admin/comment/answer',
                                        state: {
                                            comment
                                        }
                                    }}>
                                        <button className="btn btn-primary ml-2 text-white">پاسخ</button>
                                    </Link>
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

export default SectionUnverifiedComments;

import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR, YOU_SURE} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";
import {isAllowed} from "../../../../../config/auth";
import Spinner from "../../../../section/Spinner";
import Pagination from "../../../../section/Pagination";

class SectionComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: null,
            currentComments: null,
            commentsPerPage: 10,
            currentPage: 1,
            indexOfFirstComment: 0,
            indexOfLastComment: 0
        };
    }

    initialsPage = () => {
        const {currentPage, commentsPerPage, comments} = this.state;

        const indexOfLastComment = currentPage * commentsPerPage;
        const indexOfFirstComment = indexOfLastComment - commentsPerPage;
        const currentComments = comments ? comments.slice(indexOfFirstComment, indexOfLastComment) : null;

        this.setState(prevState => ({
            ...prevState,
            indexOfLastComment,
            indexOfFirstComment,
            currentComments,
        }));
    };

    // Get Comments
    componentDidMount() {

        Axios.get(API_ADMIN + `/comments?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                let comments = response.data.data.data;
                if (response.data.status === "success") {
                    this.setState(prevState => ({
                        ...prevState,
                        comments: comments,
                    }));
                    this.initialsPage();
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

    //change page
    paginate = (e, pageNumber) => {

        e.preventDefault();
        this.setState(prevState => ({
            ...prevState,
            currentPage: pageNumber,
        }), () => this.initialsPage()
        );
    };

    render() {
        const {currentComments, commentsPerPage, comments , currentPage} = this.state;
        return (
            <div>
                {currentComments ?
                    <div>

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
                            {currentComments.map((comment, index) => (
                                <tr key={index} className="text-right">
                                    <th>{index + 1}</th>
                                    <td className="text-primary align-middle">
                                        <div dangerouslySetInnerHTML={{__html: `${comment.comment}`}}/>
                                    </td>

                                    <td className="text-info align-middle">{comment.user.name}</td>

                                    {/*TODO : Show Commentabel Type*/}
                                    <td className="text-primary align-middle">

                                        {comment.commentable_type = "App\Articles" ? "مقالات" : "دوره های آموزشی"}

                                    </td>
                                    <td className="align-middle">
                                        <button className="btn btn-danger"
                                                onClick={() => this.onDelete(comment)}>حذف
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

                        <Pagination paginate={this.paginate} itemsPerPage={commentsPerPage}
                                    totalItems={comments.length} currentPage={currentPage}/>

                    </div>
                    : <Spinner/>}

            </div>
        )
    }
}

export default SectionComments;

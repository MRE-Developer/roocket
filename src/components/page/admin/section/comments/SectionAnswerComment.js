import React, {Component} from "react";
import {Link} from "react-router-dom";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME} from "../../../../../config/config";
import swal from "sweetalert";

class SectionAnswerComment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.location.state.comment,
            answer: "",
            error: null
        };
    }

    handleChange = e => {
        const {value} = e.target;
        this.setState(prevState => ({
            ...prevState,
            answer: value
        }))
    };

    submitData = (e) => {
        e.preventDefault();
        const {comment, answer} = this.state;

        Axios.post(API_ADMIN + `/comment/${comment.id}/answer`,
            {
                api_token: localStorage.getItem(APP_TOKEN_NAME),
                comment : answer
            }
        )
            .then((response) => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "کامنت به درستی پاسخ داده شد.", "success");
                    this.props.history.push("/admin/comments")
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "متاسفانه کامنت پاسخ داده نشد.", "error");
            });
    };

    render() {
        const {comment, error} = this.state;
        return (
            <div className="mt-3">
                {/*Comment*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="text-primary"><h5>کامنت :</h5></label>
                        <p>{comment.comment}</p>
                    </div>
                </div>
                {/*Description*/}
                <div className="form-group">
                    <label className="text-primary">پاسخ</label>
                    <textarea
                        className={["form-control", error ? "is-invalid" : ""].join(" ")}
                        onChange={this.handleChange}
                        placeholder="پاسخ"
                        rows="3"/>
                    {error && <span className="text-danger mt-2">{error}</span>}
                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>ارسال</button>
                <Link className="btn btn-danger ml-2" to="/admin/comments">انصراف</Link>
            </div>
        )
    }
}

export default SectionAnswerComment;

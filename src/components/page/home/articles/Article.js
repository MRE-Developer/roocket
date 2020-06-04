import React, {Component} from "react";
import axios from 'axios';
import {API_ROUTE, APP_TOKEN_NAME} from "../../../../config/config";
import "../../../../styles/Cummon.css"
import {Link} from "react-router-dom";
import Spinner from "../../../section/Spinner";
import store from "../../../../store";
import swal from "sweetalert";
import moment from "moment-jalaali"
import fa from "moment/locale/fa";
import validator from "validator"

class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null,
            comment: "",
            answerItem: null,
            error: ""
        };
    }

    componentDidMount() {
        const {params} = this.props.match;
        axios.get(API_ROUTE + /article/ + params.slug)
            .then(response => {
                this.setState(prevState => ({
                    ...prevState,
                    article: response.data.data
                }))
            })
            .catch(error => console.log(error))
    }

    handleComment = (e) => {
        const comment = e.target.value;
        let error = comment.length < 5 ? "متن کامنت نمیتواند کمتر از  5 کاراکتر باشد." : "";
        this.setState(prevState => ({
            ...prevState,
            comment,
            error
        }))
    };

    handleAnswer = (e) => {
        const answer = e.target.value;
        let error = answer.length < 5 ? "متن کامنت نمیتواند کمتر از  5 کاراکتر باشد." : "";
        this.setState(prevState => ({
            ...prevState,
            answerItem: {
                ...prevState.answerItem,
                answer
            },
            error
        }))
    };

    SubmitComment = article => {
        const {comment} = this.state;
        if (validator.isLength(comment, {min: 5})) {
            axios.post(API_ROUTE + "/comment", {
                comment: comment,
                commentable_id: article.id,
                commentable_type: "App\\Article",
                api_token: localStorage.getItem(APP_TOKEN_NAME)
            })
                .then(response => {
                    swal("عملیات موفق", "نظر شما ثبت شد, بعد از تایید منتشر خواهد شد.", "success");
                    this.setState(prevState => ({
                        ...prevState,
                        comment: ""
                    }))
                })
                .catch(error => console.log(error))

        } else {
            swal("توجه!!!", "لطفا متن کامنت را وارد کنید", "warning");
        }
    };

    selectComment = (answerItem) => () => {
        answerItem.answer = "";
        console.log(answerItem.answer);
        this.setState(prevState => ({
            ...prevState,
            answerItem
        }))
    };

    SubmitAnswer = (e) => {
        e.preventDefault();
        const {answerItem} = this.state;
        if (validator.isLength(answerItem.answer, {min: 5})) {
            axios.post(API_ROUTE + `/comment/${answerItem.id}/answer` , {
                comment: answerItem.answer,
                parent_id: answerItem.id,
                commentable_id: answerItem.commentable_id,
                commentable_type: answerItem.commentable_type,
                api_token: localStorage.getItem(APP_TOKEN_NAME)
            })
                .then(response => {
                    swal("عملیات موفق", "نظر شما ثبت شد, بعد از تایید منتشر خواهد شد.", "success");
                    this.setState(prevState => ({
                        ...prevState,
                        answerItem: null
                    }))
                })
                .catch(error => console.log(error.message))
        } else {
            swal("توجه!!!", "لطفا متن کامنت را وارد کنید", "warning");
        }
    };

    render() {
        const {article, comment, answerItem, error} = this.state;
        const user = store.getState().user.user;
        return (
            <div className="container mb-5">
                <div className="header-margin rtl">

                    {article ?
                        <div>
                            <div className="text-center mt">
                                <img height="300px" width="500px" alt="100%x180"
                                     src={"http://localhost:8000" + article.image_url}
                                     data-holder-rendered="true"/>
                            </div>

                            <div className="row justify-content-between mt-3 align-items-center">
                                <h2 cla>عنوان مقاله : </h2>
                                <div className="">
                                    <h5>تالیف : <span className="text-primary">{article.user.name}</span></h5>
                                </div>
                            </div>
                            <h2 className="text-primary text-center">{article.title}</h2>

                            <hr/>
                            <div id="articleBody" dangerouslySetInnerHTML={{__html: `${article.body}`}}/>
                            <div className="row justify-content-between">
                                <h5>دسته بندی :<Link to={`/category/${article.category.slug}`}
                                                     className="text-primary"> {article.category.name}</Link></h5>

                                <h5>
                                    <a className="text-primary" href={article.source_url} target="_blank">منبع</a>
                                </h5>

                                <h5>تگ ها :

                                    {article.tags.map((tag, index) => <span key={index}
                                                                            className="badge bg-info ml-2 p-1">
                                    <Link className="text-light" to={`/tags/${tag.slug}`}>{tag.name}#</Link>
                                </span>)}
                                </h5>
                            </div>

                            <hr/>

                            {user.name != null ?
                                <div className="well col-8">
                                    <h4>ثبت نظر :</h4>
                                    <div>
                                        <textarea id="textareas" className="form-control" onChange={this.handleComment}
                                                  value={comment} name="comment"
                                                  rows="3"/>
                                        {error.length > 0 &&
                                        <div className="mt-2"><span className="text-danger">{error}</span></div>}

                                        < button className="btn btn-primary mt-3"
                                                 onClick={() => this.SubmitComment(article)}>ارسال
                                        </button>
                                    </div>
                                </div>
                                :
                                <div className="alert alert-danger">جهت ارسال نظر لطفا وارد سایت شوید.</div>
                            }

                            <hr/>

                            {article.comments.map((comment, index) => (
                                <div className="media border p-2" key={index}>
                                    <a className="pull-right" href="#">
                                        <img className="media-object" width="64" height="64"  src={"http://localhost:8000" + comment.user.image_url}
                                             alt=""/>
                                    </a>
                                    <div className="media-body ml-2">
                                        <div>
                                            <h5 className="media-heading d-inline ">{comment.user.name + `  `}</h5>
                                            <span
                                                className="small">{moment(comment.created_at, 'YYYY-M-D HH:mm:ss', "fa").fromNow()}</span>
                                            <button className="float-left btn btn-xs btn-success"
                                                    onClick={this.selectComment(comment)}
                                                    data-toggle="modal" data-target="#sendCommentModal"
                                            >پاسخ
                                            </button>
                                        </div>

                                        <div className="ml-2 mb-3">
                                            <div dangerouslySetInnerHTML={{__html: `${comment.comment}`}}/>

                                        </div>

                                        {comment.comments.map((childComment, index) => (

                                            <div className="media mt-2" key={index}>
                                                <a className="pull-right" href="#">
                                                    <img className="media-object"
                                                         width="64" height="64"  src={"http://localhost:8000" + childComment.user.image_url}
                                                         alt=""/>
                                                </a>
                                                <div className="media-body ml-2">
                                                    <h5 className="media-heading  d-inline">{childComment.user.name + `  `}</h5>
                                                    <span
                                                        className="small">{moment(childComment.created_at, 'YYYY-M-D HH:mm:ss', "fa").fromNow()}</span>
                                                    <div
                                                        dangerouslySetInnerHTML={{__html: `${childComment.comment}`}}/>
                                                </div>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="modal" id="sendCommentModal" ref="modal" tabIndex="-1"
                                 role="dialog"
                                 aria-labelledby="sendCommentModalLabel">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h4 className="modal-title" id="exampleModalLabel">ارسال
                                                پاسخ</h4>
                                        </div>
                                        <div className="modal-body">

                                            <form onSubmit={this.SubmitAnswer}>
                                                <div className="form-group">
                                                    <label htmlFor="message-text" className="control-label">متن
                                                        پاسخ:</label>

                                                    <textarea name="comment"
                                                              value={`${answerItem ? answerItem.answer : ""}`}
                                                              className="form-control"
                                                              onChange={this.handleAnswer}/>
                                                    {error.length > 0 &&
                                                    <div className="mt-2"><span className="text-danger">{error}</span>
                                                    </div>}

                                                </div>
                                                <div className="modal-footer">
                                                    <button type="submit"
                                                            className="btn btn-primary">ارسال
                                                    </button>
                                                    <button type="button" className="btn btn-default"
                                                            data-dismiss="modal">انصراف
                                                    </button>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        :
                        ""
                    }
                </div>
            </div>

        )
    }
}

export default Article;

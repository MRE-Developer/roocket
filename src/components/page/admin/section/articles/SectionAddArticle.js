import React, {Component} from "react";
import Select from 'react-select';
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import swal from "sweetalert";
import validator from 'validator';
import {Link} from "react-router-dom";

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class AddArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            tags: [],
            errors: {},
            article: {
                title: "",
                description: "",
                body: "",
                source_url: "",
                image: null,
                tags: [],
                category_id: "",
            },
        };
    }

    componentDidMount() {
        Axios.get(API_ADMIN + "/createArticle?api_token=" + localStorage.getItem(APP_TOKEN_NAME))
            .then((response) => {
                if (response.data.status === "success") {
                    const tags = response.data.data.tags.map((tag) => (
                        {value: `${tag.id}`, label: `${tag.name}`}
                    ));

                    const categories = response.data.data.categories.map((category) => (
                        {value: `${category.id}`, label: `${category.name}`}
                    ));

                    this.setState({categories, tags});
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    handleChangeCategory = selectedOption => {
        this.setState(prevState => ({article: {...prevState.article, category_id: selectedOption.value}}));
    };
    handleChangeTags = selectedOption => {
        let tags = [];
        if (selectedOption != null) tags = selectedOption.map(tag => (tag.value));
        this.setState(prevState => ({article: {...prevState.article, tags}}));
    };
    handleChange = (e) => {
        const {name, value} = e.target;
        let {errors} = this.state;
        switch (name) {
            case 'title':
                errors.title =
                    !validator.isLength(value, {min: 10})
                        ? 'عنوان مقاله نباید کمتر از 10 کاراکتر باشد!'
                        : '';
                break;
            case 'description':
                errors.description =
                    !validator.isLength(value, {min: 20})
                        ? 'توضیحات مقاله نباید کمتر از 20 کاراکتر باشد!'
                        : '';
                break;
            case 'source_url':
                errors.source_url =
                    !validator.isLength(value, {min: 10})
                        ? 'منبع مقاله نباید کمتر از 10 کاراکتر باشد!'
                        : '';
                break;
            default:
                break;
        }

        this.setState(prevState => ({
            errors,
            article: {
                ...prevState.article,
                [name]: value
            }
        }));
    };
    changeImage = (event) => {
        const image = event.target.files[0];
        this.setState(prevState => ({
            article: {
                ...prevState.article,
                image
            }
        }));
    };
    submitData = (e) => {
        e.preventDefault();
        const {article} = this.state;
        console.log(article);
        if (article.title.length && article.source_url.length > 10 &&
            article.body.length && article.description.length > 20 &&
            article.category_id && article.tags.length && article.image) {

            const formDta = new FormData();
            formDta.append("api_token", localStorage.getItem(APP_TOKEN_NAME));
            formDta.append("title", article.title);
            formDta.append("image", article.image);
            formDta.append("description", article.description);
            formDta.append("body", article.body);
            formDta.append("source_url", article.source_url);
            formDta.append("tags", article.tags);
            formDta.append("category_id", article.category_id);

            Axios.post(`${API_ADMIN}/article`, formDta,
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "مقاله به درستی ثبت شد.", "success")
                        .then(this.props.history.push(`/admin/articles`))
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            }).catch(error => {
                const data = error.response.data.data;
                let errors = Object.keys(data).map((keyName) => {
                    return errors += `${data[keyName][0]}\n`
                });
                swal("عملیات ناموفق", errors, "error");
            })
        } else {
            swal("عملیات ناموفق", "ورودی های خود را برسی کنید.", "error");
        }
    };

    /* modules = {
         toolbar: [
                 ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                 ['blockquote', 'code-block'],

                 [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                 [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                 [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                 [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                 [{ 'direction': 'ltr' }],                         // text direction

                 [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                 [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                 [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                 [{ 'font': [] }],
                 ['link', 'image'],
                 [{ 'align': [] }],

                 ['clean']                                         // remove formatting button
         ],
     };

     formats = [
         'header',
         'bold', 'italic', 'underline', 'strike', 'blockquote' , 'color',
         'list', 'bullet', 'indent',
         'link', 'image'
     ];*/

    render() {
        const {categories, tags, errors} = this.state;

        return (
            <div className="mt-3">
                {/*Title*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">عنوان مقاله</label>
                        <input type="text"
                               className={["form-control", errors["title"] ? "is-invalid" : ""].join(" ")}
                               name="title"
                               onChange={this.handleChange}
                               placeholder="عنوان مقاله"/>
                        {errors["title"] &&
                        <span className="text-danger mt-2">{errors["title"]}</span>}
                    </div>
                </div>
                {/*Description*/}
                <div className="form-group">
                    <label htmlFor="inputAddress">توضیحات</label>
                    <textarea
                        className={["form-control", errors["description"] ? "is-invalid" : ""].join(" ")}
                        name="description"
                        onChange={this.handleChange}
                        placeholder="توضیحات" rows="2"/>
                    {errors["description"] &&
                    <span className="text-danger mt-2">{errors["description"]}</span>}
                </div>

                {/*Body*/}
                <div className="form-group">
                    <label htmlFor="inputAddress2">متن مقاله</label>

                    <CKEditor
                        editor = {ClassicEditor}
                        config={{
                            language: 'fa',
                        }}
                        name="body"

                        onBlur={(event, editor) => {
                            const body = editor.getData();
                            const error = !validator.isLength(body, {min: 20}) ? "متن مقاله نباید کمتر از 20 کاراکتر باشد." : "";
                            this.setState(prevState => ({
                                errors: {
                                    ...prevState.errors,
                                    body: error
                                },
                                article: {
                                    ...prevState.article,
                                    body
                                }
                            }));
                        }}
                    />

                    {errors["body"] &&
                    <span className="text-danger mt-2">{errors["body"]}</span>}
                </div>

                {/*Categories*/}
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="inputState">دسته بندی ها</label>
                        <Select
                            onChange={this.handleChangeCategory}
                            options={categories}
                        />
                    </div>

                    {/*Tags*/}
                    <div className="form-group col-md-4">
                        <label htmlFor="inputState">تگ ها</label>
                        <Select
                            closeMenuOnSelect={false}
                            isMulti
                            onChange={this.handleChangeTags}
                            options={tags}
                        />
                    </div>

                    {/*Image*/}
                    <div className="form-group col-md-4">
                        <label htmlFor="image">عکس مقاله</label><br/>
                        <input type="file" name="image"
                               className="text-center center-block file-upload mt-2 mr-2"
                               onChange={this.changeImage}/>
                    </div>
                </div>

                {/*Source*/}
                <div className="form-group">
                    <div className="form-group">
                        <label htmlFor="inputCity">منبع</label>
                        <input type="text"
                               className={["form-control", errors["source_url"] ? "is-invalid" : ""].join(" ")}
                               name="source_url"
                               onChange={this.handleChange}
                               placeholder="منبع"/>
                        {errors["source_url"] &&
                        <span className="text-danger mt-2">{errors["source_url"]}</span>}
                    </div>
                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>تکمیل اطلاعات</button>
                <Link className="btn btn-danger ml-2" to="/admin/articles">انصراف</Link>
            </div>
        )
    }
}

export default AddArticle;

import React, {useState, useEffect} from 'react';
import Select from "react-select";
import {Link} from "react-router-dom";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import axios from "axios";
import swal from "sweetalert";
import validator from 'validator';

const SectionAddCourse = (props) => {

    const [course, setCourse] = useState({
        title: "",
        description: "",
        body: "",
        price: "",
        category_id: "",
        tags: [],
        type: ""
    });
    const [errors, setErrors] = useState({});
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchIniDetails();
    }, []);

    const fetchIniDetails = () => {
        axios.get(`${API_ADMIN}/createCourse?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then(response => {
                if (response.data.status === "success") {

                    setTags(() => response.data.data.tags.map((tag) => (
                            {value: `${tag.id}`, label: `${tag.name}`}
                        ))
                    );

                    setCategories(() => response.data.data.categories.map((category) => (
                            {value: `${category.id}`, label: `${category.name}`}
                        ))
                    );
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch(err => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            })
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        let errors = {};
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
            case 'body':
                errors.body =
                    !validator.isLength(value, {min: 50})
                        ? 'متن مقاله نباید کمتر از 50 کاراکتر باشد!'
                        : '';
                break;
            case 'price':
                errors.price =
                    !validator.isLength(value, {min: 1})
                        ? 'قیمت نمیتواند خالی باشد!'
                        : '';
                break;
            default:
                break;
        }

        setErrors(errors);

        setCourse(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeCategory = selectedOption => {
        setCourse(prevState => ({...prevState, category_id: selectedOption.value}))
    };
    const handleChangeType = selectedOption => {
        setCourse(prevState => ({...prevState, type: selectedOption.value}))
    };
    const handleChangeTags = selectedOption => {
        let tags = [];
        if (selectedOption != null) tags = selectedOption.map(tag => (tag.value));
        setCourse(prevState => ({...prevState, tags}));
    };

    const changeImage = (event) => {
        const image = event.target.files[0];
        setCourse(prevState => ({...prevState, image}));
    };

    const submitData = () => {

        if (
            validator.isLength(course.title, {min: 10}) &&
            validator.isLength(course.description, {min: 20}) &&
            validator.isLength(course.body, {min: 50}) &&
            !validator.isEmpty(course.category_id) &&
            course.tags.length &&
            course.image &&
            !validator.isEmpty(course.price) &&
            !validator.isEmpty(course.type)
        ) {

            const formDta = new FormData();
            formDta.append("api_token", localStorage.getItem(APP_TOKEN_NAME));
            formDta.append("title", course.title);
            formDta.append("image", course.image);
            formDta.append("description", course.description);
            formDta.append("body", course.body);
            formDta.append("tags", course.tags);
            formDta.append("price", course.price);
            formDta.append("category_id", course.category_id);
            formDta.append("type", course.type);
            formDta.append("status", 0);

            axios.post(`${API_ADMIN}/course`, formDta,
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "دوره به درستی ثبت شد.", "success")
                        .then(props.history.push(`/admin/courses`))
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            }).catch(error => {

                const data = error.response.data.data;
                let errors = "";
                Object.keys(data).map((keyName) => {
                    return errors += `${data[keyName][0]}\n`
                });
                swal("عملیات ناموفق", errors, "error");
            })
        } else {
            swal("عملیات ناموفق", "ورودی های خود را برسی کنید.", "error");
        }
    };

    return (
        <div>

            <div className="mt-3">
                {/*Title*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">عنوان دوره</label>
                        <input type="text"
                               className={["form-control", errors["title"] ? "is-invalid" : ""].join(" ")}
                               name="title"
                               onChange={handleChange}
                               placeholder="عنوان دوره"/>
                        {errors["title"] &&
                        <span className="text-danger mt-2">{errors["title"]}</span>}
                    </div>
                </div>
                {/*Description*/}
                <div className="form-group">
                    <label htmlFor="inputAddress">توضیحات</label>
                    <textarea
                        name="description"
                        className={["form-control", errors["description"] ? "is-invalid" : ""].join(" ")}
                        onChange={handleChange}
                        placeholder="توضیحات" rows="2"/>
                    {errors["description"] &&
                    <span className="text-danger mt-2">{errors["description"]}</span>}
                </div>

                {/*Body*/}
                <div className="form-group">
                    <label htmlFor="inputAddress2">متن دوره</label>

                    <textarea
                        name="body"
                        className={["form-control", errors["body"] ? "is-invalid" : ""].join(" ")}
                        onChange={handleChange}
                        placeholder="متن دوره" rows="2"/>
                    {errors["body"] &&
                    <span className="text-danger mt-2">{errors["body"]}</span>}
                </div>

                {/*Categories*/}
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="inputState">دسته بندی ها</label>
                        <Select
                            name="categories"
                            onChange={handleChangeCategory}
                            options={categories}
                        />
                    </div>

                    {/*Tags*/}
                    <div className="form-group col-md-4">
                        <label htmlFor="inputState">تگ ها</label>
                        <Select
                            closeMenuOnSelect={false}
                            isMulti
                            onChange={handleChangeTags}
                            options={tags}
                        />
                    </div>

                    <div className="form-row">
                        {/*Type*/}
                        <div className="form-group col-md-4">
                            <label htmlFor="inputState">نوع دوره</label>
                            <Select
                                onChange={handleChangeType}
                                options={[
                                    {value: "free", label: "رایگان"},
                                    {value: "vip", label: "کاربر ویژه"},
                                    {value: "price", label: "نقدی"},
                                ]}
                            />
                        </div>

                        <div className="form-row">
                            {/*price*/}
                            <div className="form-group col-md-4">
                                <label htmlFor="inputState">قیمت</label>
                                <input type="text"
                                       className={["form-control", errors["price"] ? "is-invalid" : ""].join(" ")}
                                       name="price"
                                       onChange={handleChange}
                                       placeholder="قیمت"/>
                                {errors["price"] &&
                                <span className="text-danger mt-2">{errors["price"]}</span>}
                            </div>

                            {/*Image*/}
                            <div className="form-group col-md-4">
                                <label htmlFor="image">عکس دوره</label><br/>
                                <input type="file" name="image"
                                       className="text-center center-block file-upload mt-2 mr-2"
                                       onChange={changeImage}/>
                            </div>
                        </div>

                        {/*Submit*/}
                        <button type="submit" className="btn btn-primary" onClick={submitData}>تکمیل اطلاعات</button>
                        <Link className="btn btn-danger ml-2" to="/admin/courses">انصراف</Link>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default SectionAddCourse;
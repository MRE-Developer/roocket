import React, {useState, useEffect} from 'react';
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import swal from "sweetalert";
import Select from "react-select";
import {Link} from "react-router-dom";
import validator from "validator";

const SectionEditCourse = (props) => {

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
        fetchData();
    }, []);

    const fetchData = () => {

        Axios.get(API_ADMIN + `/course/${props.match.params.slug}/edit?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    const data = response.data.data;
                    setTags(data.tags.map((tag) => (
                        {value: `${tag.id}`, label: `${tag.name}`}
                    )));

                    setCategories(data.categories.map((category) => (
                        {value: `${category.id}`, label: `${category.name}`}
                    )));

                    const selectedTags = data.course.tags.map(tag => (
                        {value: `${tag.id}`, label: `${tag.name}`}
                    ));

                    let type = data.course.type;
                    let selectedType = {
                        value: type,
                        label: type === "vip" ? "کاربر ویژه" :
                            type === "price" ? "نقدی" : "رایگان"
                    };

                    setCourse({
                        ...data.course,
                        selectedCategory: {value: data.course.category.id, label: data.course.category.name},
                        selectedState: {value: data.course.status, label: data.course.status === 0 ? "درحال برگذاری" : "تکمیل شده"},
                        selectedTags,
                        selectedType,
                        tags: data.course.tags.map(tag => tag.id)
                    });

                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });

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
        setCourse(prevState => ({...prevState, category_id: selectedOption.value, selectedCategory: selectedOption}));
    };
    const handleChangeType = selectedOption => {
        setCourse(prevState => ({...prevState, type: selectedOption.value, selectedType: selectedOption}));
    };
    const handleChangeStatus = selectedOption => {
        setCourse(prevState => ({...prevState, status: selectedOption.value, selectedState: selectedOption}));
    };
    const handleChangeTags = selectedOption => {
        let tags = [];
        if (selectedOption != null) tags = selectedOption.map(tag => (tag.value));
        setCourse(prevState => ({...prevState, tags, selectedTags: selectedOption}));
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
            course.category_id &&
            course.tags.length &&
            !validator.isEmpty(course.price) &&
            !validator.isEmpty(course.type)
        ) {

            const formDta = new FormData();
            formDta.append("api_token", localStorage.getItem(APP_TOKEN_NAME));
            formDta.append("title", course.title);
            if (course.image) formDta.append("image", course.image);
            formDta.append("description", course.description);
            formDta.append("body", course.body);
            formDta.append("tags", course.tags);
            formDta.append("price", course.price);
            formDta.append("category_id", course.category_id);
            formDta.append("type", course.type);
            formDta.append("status", course.status);

            Axios.post(`${API_ADMIN}/course/${course.slug}/update`, formDta,
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "دوره به درستی به روزرسانی شد.", "success")
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
                               value={course.title}
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
                        value={course.description}
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
                        value={course.body}
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
                            value={course.selectedCategory}
                            options={categories}
                        />
                    </div>

                    {/*Tags*/}
                    <div className="form-group col-md-4">
                        <label htmlFor="inputState">تگ ها</label>
                        <Select
                            closeMenuOnSelect={false}
                            isMulti
                            value={course.selectedTags}
                            onChange={handleChangeTags}
                            options={tags}
                        />
                    </div>

                    <div className="form-row">
                        {/*Type*/}
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">نوع دوره</label>
                            <Select
                                onChange={handleChangeType}
                                value={course.selectedType}
                                options={[
                                    {value: "free", label: "رایگان"},
                                    {value: "vip", label: "کاربر ویژه"},
                                    {value: "price", label: "نقدی"},
                                ]}
                            />
                        </div>

                        {/*State*/}
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">وضعیت دوره</label>
                            <Select
                                onChange={handleChangeStatus}
                                value={course.selectedState}
                                options={[
                                    {value: "0", label: "در حال برگذاری"},
                                    {value: "1", label: "تکمیل شده"},
                                ]}
                            />
                        </div>


                        {/*price*/}
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">قیمت</label>
                            <input type="text"
                                   className={["form-control", errors["price"] ? "is-invalid" : ""].join(" ")}
                                   name="price"
                                   value={course.price}
                                   onChange={handleChange}
                                   placeholder="قیمت"/>
                            {errors["price"] &&
                            <span className="text-danger mt-2">{errors["price"]}</span>}
                        </div>

                        {/*Image*/}
                        <div className="form-group col-md-3">
                            <label htmlFor="image">عکس دوره</label><br/>
                            <input type="file" name="image"
                                   className="text-center center-block file-upload mt-2 mr-2"
                                   onChange={changeImage}/>
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

export default SectionEditCourse
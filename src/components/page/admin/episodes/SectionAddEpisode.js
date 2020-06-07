import React, {useState, useEffect} from 'react';
import Select from "react-select";
import {Link} from "react-router-dom";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../src/config/config";
import axios from "axios";
import swal from "sweetalert";
import validator from 'validator';

const SectionAddEpisode = (props) => {

    const [episode, setEpisode] = useState({
        title: "",
        body: "",
        time: "",
        course_id: "",
        type: "",
        number: "",
    });
    const [errors, setErrors] = useState({});
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchIniDetails();
    }, []);

    const fetchIniDetails = () => {
        axios.get(`${API_ADMIN}/createEpisode?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then(response => {
                if (response.data.status === "success") {

                    setCourses(() => response.data.data.map((course) => (
                            {value: `${course.id}`, label: `${course.title}`}
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
                        ? 'عنوان ویدیو نباید کمتر از 10 کاراکتر باشد!'
                        : '';
                break;
            case 'body':
                errors.body =
                    !validator.isLength(value, {min: 50})
                        ? 'متن ویدیو نباید کمتر از 50 کاراکتر باشد!'
                        : '';
                break;
            case 'time':
                errors.price =
                    !validator.isLength(value, {min: 4})
                        ? 'زمان ویدیو نمیتواند کمتر از 4 کارکتر باشد!'
                        : '';
                break;

            case 'number':
                errors.price =
                    !validator.isLength(value, {min: 1})
                        ? 'زمان ویدیو نمیتواند خالی باشد!'
                        : '';
                break;

            case 'video_url':
                errors.video_url =
                    !validator.isLength(value, {min: 10})
                        ? 'آدرس ویدیو نمیتواند کمتر از 10 کارکتر باشد!'
                        : '';
                break;
            default:
                break;
        }

        setErrors(errors);

        setEpisode(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeCourse = selectedOption => {
        setEpisode(prevState => ({...prevState, course_id: selectedOption.value}))
    };

    const handleChangeType = selectedOption => {
        setEpisode(prevState => ({...prevState, type: selectedOption.value}))
    };

    const submitData = () => {

        if (
            validator.isLength(episode.title, {min: 10}) &&
            validator.isLength(episode.body, {min: 50}) &&
            validator.isLength(episode.video_url, {min: 10}) &&
            validator.isLength(episode.time, {min: 4}) &&
            !validator.isEmpty(episode.course_id) &&
            !validator.isEmpty(episode.number) &&
            !validator.isEmpty(episode.type)
        ) {
            axios.post(`${API_ADMIN}/episode`,
                {
                    api_token: localStorage.getItem(APP_TOKEN_NAME),
                    title: episode.title,
                    body: episode.body,
                    video_url: episode.video_url,
                    number: episode.number,
                    course_id: episode.course_id,
                    time: episode.time,
                    type: episode.type,
                },
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "ویدیو به درستی ثبت شد.", "success")
                        .then(props.history.push(`/admin/episodes`))
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
                        <label htmlFor="inputEmail4">عنوان ویدیو</label>
                        <input type="text"
                               className={["form-control", errors["title"] ? "is-invalid" : ""].join(" ")}
                               name="title"
                               onChange={handleChange}
                               placeholder="عنوان ویدیو"/>
                        {errors["title"] &&
                        <span className="text-danger mt-2">{errors["title"]}</span>}
                    </div>
                </div>

                {/*Body*/}
                <div className="form-group">
                    <label htmlFor="inputAddress2">متن ویدیو</label>

                    <textarea
                        name="body"
                        className={["form-control", errors["body"] ? "is-invalid" : ""].join(" ")}
                        onChange={handleChange}
                        placeholder="متن ویدیو" rows="2"/>
                    {errors["body"] &&
                    <span className="text-danger mt-2">{errors["body"]}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">آدرس ویدیو</label>
                        <input type="text"
                               className={["form-control", errors["video_url"] ? "is-invalid" : ""].join(" ")}
                               name="video_url"
                               onChange={handleChange}
                               placeholder="آدرس ویدیو"/>
                        {errors["video_url"] &&
                        <span className="text-danger mt-2">{errors["video_url"]}</span>}
                    </div>

                    <div className="form-group col-md-3">
                        <label htmlFor="inputEmail4">شماره ویدیو</label>
                        <input type="text"
                               className={["form-control", errors["number"] ? "is-invalid" : ""].join(" ")}
                               name="number"
                               onChange={handleChange}
                               placeholder="شماره ویدیو"/>
                        {errors["number"] &&
                        <span className="text-danger mt-2">{errors["number"]}</span>}
                    </div>

                    <div className="form-group col-md-3">
                        <label htmlFor="inputEmail4">زمان ویدیو</label>
                        <input type="text"
                               className={["form-control", errors["time"] ? "is-invalid" : ""].join(" ")}
                               name="time"
                               onChange={handleChange}
                               placeholder="زمان ویدیو"/>
                        {errors["time"] &&
                        <span className="text-danger mt-2">{errors["time"]}</span>}
                    </div>
                </div>

                {/*Courses*/}
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="inputState">دوره ها</label>
                        <Select
                            name="courses"
                            onChange={handleChangeCourse}
                            options={courses}
                        />
                    </div>

                    {/*Type*/}
                    <div className="form-group col-md-3">
                        <label htmlFor="inputState">نوع ویدیو</label>
                        <Select
                            onChange={handleChangeType}
                            options={[
                                {value: "free", label: "رایگان"},
                                {value: "cash", label: "نقدی"},
                            ]}
                        />
                    </div>

                </div>
                <div className="form-row">
                    {/*Submit*/}
                    <button type="submit" className="btn btn-primary" onClick={submitData}>تکمیل اطلاعات
                    </button>
                    <Link className="btn btn-danger ml-2" to="/admin/episodes">انصراف</Link>
                </div>
            </div>
        </div>
    )
};

export default SectionAddEpisode;
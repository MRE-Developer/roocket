import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import swal from "sweetalert";
import validator from "validator";
import Select from "react-select";
import {Link} from "react-router-dom";

class SectionEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.location.state.user,
            errors: {}
        };
    }

    componentDidMount() {
        this.setState(prevState => ({
            user : {
                ...prevState.user,
                password : "",
                selectedLevel: {
                    value: prevState.user.level,
                    label: prevState.user.level === "user" ? "کاربر معمولی" : "ادمین"
                }
            }
        }));
    };

    handleChange = (e) => {
        const {name, value} = e.target;
        let {errors} = this.state;
        switch (name) {
            case 'name':
                errors.name =
                    !validator.isLength(value, {min: 3})
                        ? 'نام نباید کمتر از 3 کاراکتر باشد!'
                        : '';
                break;
            case 'password':
                errors.password =
                    !validator.isLength(value, {min: 6})
                        ? 'رمز عبور نباید کمتر از 6 کاراکتر باشد!'
                        : '';
                break;
            default:
                break;
        }

        this.setState(prevState => ({
            errors,
            user: {
                ...prevState.user,
                [name]: value
            }
        }));
    };

    handleChangeLevel = selectedOption => {
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                selectedLevel : selectedOption,
                level: selectedOption.value
            }
        }));
    };

    changeImage = (event) => {
        const image = event.target.files[0];
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                image
            }
        }));
    };

    submitData = (e) => {
        e.preventDefault();
        const {user} = this.state;
        if (user.name.length >= 3 && user.level.length) {

            const formDta = new FormData();
            formDta.append("api_token", localStorage.getItem(APP_TOKEN_NAME));
            formDta.append("name", user.name);
            formDta.append("level", user.level);
            formDta.append("password", user.password);
            formDta.append("image", user.image);

            Axios.post(`${API_ADMIN}/user/${user.id}/update`, formDta,
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "کاربر مورد نظر با موفقیت بروزرسانی شد.", "success")
                        .then(this.props.history.push(`/admin/users`))
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            }).catch(error => {
                const data = error.response.data.data;
                let errors = "";
                Object.keys(data).map((keyName) => {
                    errors += `${data[keyName][0]}\n`
                });
                console.log(errors);
                swal("عملیات ناموفق", errors, "error");
            })
        } else {
            swal("عملیات ناموفق", "ورودی های خود را برسی کنید.", "error");
        }
    };

    render() {

        const {errors, user} = this.state;
        return (
            <div className="mt-3">
                <div className="form-row">
                    {/*Name*/}
                    <div className="form-group col-md-6">
                        <label>نام</label>
                        <input type="text"
                               className={["form-control", errors["name"] ? "is-invalid" : ""].join(" ")}
                               name="name"
                               value={user.name}
                               onChange={this.handleChange}
                               placeholder="نام"/>
                        {errors["name"] &&
                        <span className="text-danger mt-2">{errors["name"]}</span>}
                    </div>

                    {/*Mobile*/}
                    <div className="form-group col-md-6">
                        <label>شماره تماس</label>
                        <input type="text"
                               className="form-control"
                               disabled
                               value={user.mobile}/>
                        {errors["mobile"] &&
                        <span className="text-danger mt-2">{errors["mobile"]}</span>}
                    </div>
                </div>

                <div className="form-row">
                    {/*Level*/}
                    <div className="form-group col-md-4">
                        <label>سطح</label>
                        <Select
                            onChange={this.handleChangeLevel}
                            options={[
                                {value: "user", label: "کاربر معمولی"},
                                {value: "admin", label: "ادمین"}
                            ]}
                            value={user.selectedLevel}
                        />
                    </div>

                    {/*Password*/}
                    <div className="form-group col-md-4">
                        <label>رمز عبور</label>
                        <input type="text"
                               className={["form-control", errors["password"] ? "is-invalid" : ""].join(" ")}
                               name="password"
                               onChange={this.handleChange}
                               placeholder="رمز عبور"/>
                        {errors["password"] &&
                        <span className="text-danger mt-2">{errors["password"]}</span>}
                    </div>

                    {/*Image*/}
                    <div className="form-group col-md-3">
                        <label htmlFor="image">عکس پروفایل</label><br/>
                        <input type="file" name="image"
                               className="text-center center-block file-upload mt-2 mr-2"
                               onChange={this.changeImage}/>
                    </div>
                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>تکمیل اطلاعات</button>
                <Link className="btn btn-danger ml-2" to="/admin/users">انصراف</Link>
            </div>
        )
    }
}

export default SectionEditUser;

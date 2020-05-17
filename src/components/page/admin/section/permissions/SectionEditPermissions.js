import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import swal from "sweetalert";
import validator from "validator";
import {Link} from "react-router-dom";


class SectionEditPermissions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            permission: this.props.location.state.permission,
            errors: [],
        };
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        let {errors} = this.state;
        switch (name) {
            case 'name':
                errors.name =
                    !validator.isLength(value, {min: 3})
                        ? 'نام سطح دسترسی نباید کمتر از 3 کاراکتر باشد!'
                        : '';
                break;
            case 'label':
                errors.label =
                    !validator.isLength(value, {min: 5})
                        ? 'توضیحات سطح دسترسی نباید کمتر از 5 کاراکتر باشد!'
                        : '';
                break;
            default:
                break;
        }

        this.setState(prevState => ({
            errors,
            permission: {
                ...prevState.permission,
                [name]: value
            }
        }));
    };

    submitData = (e) => {
        e.preventDefault();
        const {permission} = this.state;
        if (permission.name.length >= 3 && permission.label.length >= 5) {

            Axios.post(`${API_ADMIN}/permission/${permission.slug}/update`,
                {
                    api_token: localStorage.getItem(APP_TOKEN_NAME),
                    name: permission.name,
                    label: permission.label
                },
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "سطح دسترسی به درستی بروزرسانی شد.", "success")
                        .then(this.props.history.push(`/admin/permissions`))
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


    render() {
        const {errors, permission} = this.state;
        return (
            <div className="mt-3">
                {/*Name*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">نام سطح دسترسی</label>
                        <input type="text"
                               value={permission.name}
                               className={["form-control", errors["name"] ? "is-invalid" : ""].join(" ")}
                               name="name"
                               onChange={this.handleChange}
                               placeholder="نام دسته بندی"/>
                        {errors["name"] &&
                        <span className="text-danger mt-2">{errors["name"]}</span>}
                    </div>
                </div>

                {/*Label*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">توضیحات</label>
                        <input type="text"
                               value={permission.label}
                               className={["form-control", errors["label"] ? "is-invalid" : ""].join(" ")}
                               name="label"
                               onChange={this.handleChange}
                               placeholder="توضیحات"/>
                        {errors["label"] &&
                        <span className="text-danger mt-2">{errors["label"]}</span>}
                    </div>
                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>تکمیل اطلاعات</button>
                <Link className="btn btn-danger ml-2" to="/admin/permissions">انصراف</Link>
            </div>
        )
    }
}

export default SectionEditPermissions;

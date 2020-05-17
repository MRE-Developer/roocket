import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import swal from "sweetalert";
import validator from "validator";
import Select from "react-select";
import {Link} from "react-router-dom";


class SectionAddRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            label: "",
            permission_id : [],
            permissions : {},
            errors: []
        };
    }

    //Get Permissions
    componentDidMount() {
        Axios.get(API_ADMIN + `/permissions/all?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    const permissions = response.data.data.map((permission) => (
                        {value: `${permission.id}`, label: `${permission.name} - ${permission.label}`}
                    ));
                    this.setState({permissions});
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });

    }

    //Change Input And Handle Errors
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

        this.setState({
            errors,
            [name]: value
        });
    };

    handleChangePermissions = selectedOption => {
        let permission_id = [];
        if (selectedOption != null) permission_id = selectedOption.map(option => option.value);
        this.setState({permission_id });
    };

    submitData = (e) => {
        e.preventDefault();
        const {name, label, permission_id} = this.state;

        if (name.length >= 3  && label.length >= 5 && permission_id.length){

            Axios.post(`${API_ADMIN}/role`,
                {
                    api_token : localStorage.getItem(APP_TOKEN_NAME),
                    name,
                    label,
                    permission_id,
                },
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "مقام به درستی ثبت شد.", "success")
                        .then(this.props.history.push(`/admin/roles`))
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
        }else {
            swal("عملیات ناموفق", "ورودی های خود را برسی کنید.", "error");
        }
    };

    render() {
        const {errors, permissions} = this.state;
        return (
            <div className="mt-3">
                {/*Name*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">نام سطح دسترسی</label>
                        <input type="text"
                               className={["form-control", errors["name"] ? "is-invalid" : ""].join(" ")}
                               name="name"
                               onChange={this.handleChange}
                               placeholder="نام سطح دسترسی"/>
                        {errors["name"] &&
                        <span className="text-danger mt-2">{errors["name"]}</span>}
                    </div>
                </div>

                {/*Label*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">توضیحات</label>
                        <input type="text"
                               className={["form-control", errors["label"] ? "is-invalid" : ""].join(" ")}
                               name="label"
                               onChange={this.handleChange}
                               placeholder="توضیحات"/>
                        {errors["label"] &&
                        <span className="text-danger mt-2">{errors["label"]}</span>}
                    </div>

                    {/*Permissions*/}
                    <div className="form-group col-md-6">
                        <label htmlFor="inputState">دسترسی ها</label>
                        <Select
                            closeMenuOnSelect={false}
                            isMulti
                            onChange={this.handleChangePermissions}
                            options={permissions}
                        />
                    </div>

                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>تکمیل اطلاعات</button>
                <Link className="btn btn-danger ml-2" to="/admin/roles">انصراف</Link>
            </div>
        )
    }
}

export default SectionAddRole;

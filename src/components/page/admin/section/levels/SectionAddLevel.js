import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import swal from "sweetalert";
import Select from "react-select";
import {Link} from "react-router-dom";


class SectionAddLevel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: "",
            role_id: [],
            roles : [],
            users : [],
            errors: []
        };
    }

    //Get Role And Users
    componentDidMount() {
        Axios.get(API_ADMIN + `/levels/details?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    const roles = response.data.data.roles.map((role) => (
                        {value: `${role.id}`, label: `${role.name} - ${role.label}`}
                    ));
                    const users = response.data.data.users.map((user) => (
                        {value: `${user.id}`, label: `${user.name} - ${user.mobile}`}
                    ));
                    this.setState({users, roles});
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });

    }

    handleChange = (selectedOption, e) => {
        if (e.name === "user_id"){
            this.setState({user_id : selectedOption.value})
        } else {
            let data = [];
            if (selectedOption != null) data = selectedOption.map(option => option.value);
            this.setState({role_id : data})
        }
    };

    submitData = (e) => {
        e.preventDefault();
        const {user_id, role_id} = this.state;

        if (user_id.length  && role_id.length){

            Axios.post(`${API_ADMIN}/level/${user_id}/create`,
                {
                    api_token : localStorage.getItem(APP_TOKEN_NAME),
                    role_id
                },
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "مقام ها به درستی برای کاربر ثبت شدند.", "success")
                        .then(this.props.history.push(`/admin/levels`))
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
            swal("توجه!!!", "لطفا موارد مورد نیاز را تکمیل کنید..", "error");
        }
    };

    render() {
        const {users, roles} = this.state;
        return (
            <div className="mt-3">
                {/*Name*/}
                <div className="form-row">
                    {/*Users*/}
                    <div className="form-group col">
                        <label htmlFor="inputState">کاربران <span className="text-danger">*</span></label>
                        <Select
                            name="user_id"
                            onChange={this.handleChange}
                            options={users}
                        />
                    </div>
                    {/*Roles*/}
                    <div className="form-group col">
                        <label htmlFor="inputState">مقام ها <span className="text-danger">*</span></label>
                        <Select
                            closeMenuOnSelect={false}
                            isMulti
                            name="role_id"
                            onChange={this.handleChange}
                            options={roles}
                        />
                    </div>
                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>تکمیل اطلاعات</button>
                <Link className="btn btn-danger ml-2" to="/admin/levels">انصراف</Link>
            </div>
        )
    }
}

export default SectionAddLevel;

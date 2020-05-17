import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import swal from "sweetalert";
import Select from "react-select";
import {Link} from "react-router-dom";

class SectionEditLevel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.location.state.user,
            selectedRoles: [],
            role_id: [],
            roles: [],
            users: [],
            errors: []
        };
    }

    //Get Roles
    componentDidMount() {
        Axios.get(API_ADMIN + `/level/${this.state.user.id}/details?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    const data = response.data.data;
                    const roles = data.roles.map((role) => (
                        {value: `${role.id}`, label: `${role.name} - ${role.label}`}
                    ));

                    const selectedRoles = data.UserRoles.map(role => (
                        {value: `${role.id}`, label: `${role.name} - ${role.label}`}
                    ));

                    const role_id = data.UserRoles.map(role => role.id);
                    this.setState({roles, selectedRoles, role_id});
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });

    }

    handleChange = selectedOption => {
            let role_id = [];
            if (selectedOption != null) role_id = selectedOption.map(option => option.value);
            this.setState({role_id, selectedRoles : selectedOption})
    };

    submitData = (e) => {
        e.preventDefault();
        const {user, role_id} = this.state;

        if (role_id.length) {

            Axios.post(`${API_ADMIN}/level/${user.id}/create`,
                {
                    api_token: localStorage.getItem(APP_TOKEN_NAME),
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
        } else {
            swal("توجه!!!", "لطفا موارد مورد نیاز را تکمیل کنید..", "error");
        }
    };

    render() {
        const {user, roles, selectedRoles} = this.state;
        return (
            <div className="mt-3">
                {/*Name*/}
                <div className="form-row">
                    {/*Users*/}
                    <div className="form-group col">
                        <label htmlFor="inputState">کاربران <span className="text-danger">*</span></label>
                        <Select
                            isDisabled
                            value={[{value: `${user.name}`, label: `${user.name} - ${user.mobile}`}]}
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
                            value={selectedRoles}
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

export default SectionEditLevel;

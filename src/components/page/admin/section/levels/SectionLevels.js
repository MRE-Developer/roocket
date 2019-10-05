import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";

class SectionLevels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            levels: []
        };
        this.props.onRef(this);
    }

    // Get Levels
    componentDidMount() {
        Axios.get(API_ADMIN + `/levels?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({levels: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", SERVER_ERROR, "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", SERVER_ERROR, "error");
            });
    };

    //  Delete User Role
    onDelete = (user, level) => {
        Axios.post(API_ADMIN + `/level/${user.id}/delete`,
            {
                "api_token" : localStorage.getItem(APP_TOKEN_NAME),
                "role_id" : level.id,
            })
            .then((response) => {
                if (response.data.status === "success") {

                    const levels = response.data.data.data;
                    swal("عملیات موفق", "مقام کاربر به درستی حذف شد.", "success");
                    this.setState({levels});
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "متاسفانه تگ حذف نشد.", "error");
            });
    };


    render() {
        const {levels} = this.state;
        let counter = 1;
        return (
            <div>
                <table className="table table-striped ">
                    <thead>
                    <tr className="text-right">
                        <th scope="col">ردیف</th>
                        <th scope="col">مقام</th>
                        <th scope="col">نام کاربر</th>
                        <th scope="col">شماره تماس کاربر</th>
                        <th scope="col">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        levels.map((level , index) => (
                            level.users.map((user, i) => (
                                <tr key={index} className="text-right">
                                    <th>{counter++}</th>
                                    <td>{level.label}</td>
                                    <td>{user.name}</td>
                                    <td>{user.mobile}</td>
                                    <td>
                                        <Link className="btn btn-primary mr-2"
                                              to={{
                                                  pathname: '/admin/level/edit',
                                                  state: {
                                                      user
                                                  }
                                              }}
                                        >ویرایش</Link>
                                        <button className="btn btn-danger"
                                                onClick={() => this.onDelete(user, level)}>حذف
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ))
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default SectionLevels;

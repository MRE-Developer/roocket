import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, SERVER_ERROR, YOU_SURE} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";
import {isAllowed} from "../../../../../config/auth";
import Spinner from "../../../../section/Spinner";

class SectionLevels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            levels: null
        };
        this.props.onRef(this);
    }

    // Get Levels
    componentDidMount() {
        Axios.get(API_ADMIN + `/levels?search=${this.props.search}&api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
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

        swal("توجه!!!", YOU_SURE("مقام کاربر"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/level/${user.id}/delete`,
                    {
                        "api_token": localStorage.getItem(APP_TOKEN_NAME),
                        "role_id": level.id,
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
            }
        });

    };

    render() {
        const {levels} = this.state;
        let counter = 1;
        return (
            <div>
                {levels ?
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
                            levels.map((level) => (
                                level.users.map((user, i) => (
                                    <tr key={i} className="text-right">
                                        <th>{counter++}</th>
                                        <td>{level.label}</td>
                                        <td>{user.name}</td>
                                        <td>{user.mobile}</td>
                                        <td>
                                            {(isAllowed("Update-Level") && level.name !== "manager") &&
                                            <Link className="btn btn-primary mr-2"
                                                  to={{
                                                      pathname: '/admin/level/edit',
                                                      state: {
                                                          user
                                                      }
                                                  }}
                                            >ویرایش</Link>
                                            }

                                            {(isAllowed("Delete-Level") && level.name !== "manager") &&
                                            <button className="btn btn-danger"
                                                    onClick={() => this.onDelete(user, level)}>حذف</button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            ))
                        }
                        </tbody>
                    </table>
                    : <Spinner/>}

            </div>
        )
    }
}

export default SectionLevels;

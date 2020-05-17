import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, YOU_SURE} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";
import {isAllowed} from "../../../../../config/auth";
import Spinner from "../../../../section/Spinner";

class SectionUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: null
        };
        this.props.onRef(this);
    }

    // Get Users
    componentDidMount() {
        Axios.get(API_ADMIN + `/users?search=${this.props.search}&api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({users: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    //  Delete User
    onDelete = (user) => {

        swal("توجه!!!", YOU_SURE("کاربر"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/user/${user.id}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
                    .then((response) => {
                        if (response.data.status === "success") {
                            swal("عملیات موفق", "کاربر به درستی حذف شد.", "success");
                            const users = this.state.users.filter((userItem) => user.id !== userItem.id);
                            this.setState({users});
                        }
                    })
                    .catch((error) => {
                        swal("عملیات ناموفق", "متاسفانه تگ حذف نشد.", "error");
                    });
            }
        });

    };

    render() {
        const {users} = this.state;
        return (
            <div>
                {users ?
                    <table className="table table-striped ">
                        <thead>
                        <tr className="text-right">
                            <th scope="col">ردیف</th>
                            <th scope="col">نام</th>
                            <th scope="col">شماره تماس</th>
                            <th scope="col">سطح</th>
                            <th scope="col">عملیات</th>
                        </tr>
                        </thead>
                        <tbody>

                        {
                            users.map((user, index) => (
                                <tr key={index} className="text-right">
                                    <th>{index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.level === "admin" ? "ادمین" : "کاربر عادی"}</td>

                                    <td>
                                        {isAllowed("Update-User") &&
                                        <Link className="btn btn-primary mr-2"
                                              to={{
                                                  pathname: '/admin/user/edit',
                                                  state: {user}
                                              }}
                                        >ویرایش</Link>
                                        }
                                        {isAllowed("Delete-User") && user.mobile !== "09185493615" &&
                                        <button className="btn btn-danger"
                                                onClick={() => this.onDelete(user)}>حذف</button>
                                        }
                                    </td>
                                </tr>
                            ))
                        }

                        </tbody>
                    </table>
                    : <Spinner/>}
            </div>
        )
    }
}

export default SectionUser;

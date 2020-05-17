import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, YOU_SURE} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";
import {isAllowed} from "../../../../../config/auth";
import Spinner from "../../../../section/Spinner";

class SectionRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roles: null
        };
        this.props.onRef(this);
    }

    // Get Roles
    componentDidMount() {
        Axios.get(API_ADMIN + `/roles?search=${this.props.search}&api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({roles: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    //  Delete User
    onDelete = (role) => {

        swal("توجه!!!", YOU_SURE("مقام"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/role/${role.slug}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
                    .then((response) => {
                        if (response.data.status === "success") {
                            swal("عملیات موفق", "مقام به درستی حذف شد.", "success");
                            const roles = this.state.roles.filter((roleItem) => role.id !== roleItem.id);
                            this.setState({roles});
                        }
                    })
                    .catch((error) => {
                        swal("عملیات ناموفق", "متاسفانه تگ حذف نشد.", "error");
                    });
            }
        });

    };

    render() {
        const {roles} = this.state;
        return (
            <div>
                {roles ?
                    <table className="table table-striped ">
                        <thead>
                        <tr className="text-right">
                            <th scope="col">ردیف</th>
                            <th scope="col">نام</th>
                            <th scope="col">توضیحات</th>
                            <th scope="col">عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            roles.map((role, index) => (
                                <tr key={index} className="text-right">
                                    <th>{index + 1}</th>
                                    <td>{role.name}</td>
                                    <td>{role.label}</td>
                                    <td>
                                        {isAllowed("Update-Role") &&
                                        <Link className="btn btn-primary mr-2"
                                              to={{
                                                  pathname: '/admin/role/edit',
                                                  state: {role}
                                              }}
                                        >ویرایش</Link>
                                        }
                                        {(isAllowed("Delete-Role") && role.name !== "manager") &&
                                        <button className="btn btn-danger"
                                                onClick={() => this.onDelete(role)}>حذف</button>
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

export default SectionRole;

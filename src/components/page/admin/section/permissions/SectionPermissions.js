import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME} from "../../../../../config/config";
import {Link} from "react-router-dom";
import swal from "sweetalert";

class SectionPermissions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            permissions: []
        };
        this.props.onRef(this);
    }

    // Get Permissions
    componentDidMount() {
        Axios.get(API_ADMIN + `/permissions?search=${this.props.search}&api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    this.setState({permissions: response.data.data.data});
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    //  Delete User
    onDelete = (permission) => {
        Axios.post(API_ADMIN + `/permission/${permission.slug}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "سطح دسترسی به درستی حذف شد.", "success");
                    const permissions = this.state.permissions.filter((permissionItem) => permission.slug !== permissionItem.slug);
                    this.setState({permissions});
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "متاسفانه تگ حذف نشد.", "error");
            });
    };

    render() {
        const {permissions} = this.state;
        return (
            <div>
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
                        permissions.map((permission, index) => (
                            <tr key={index} className="text-right">
                                <th>{index + 1}</th>
                                <td>{permission.name}</td>
                                <td>{permission.label}</td>
                                <td>
                                    <Link className="btn btn-primary mr-2"
                                          to={{
                                              pathname: '/admin/permission/edit',
                                              state: {permission}
                                          }}
                                    >ویرایش</Link>
                                    <button className="btn btn-danger" onClick={() => this.onDelete(permission)}>حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default SectionPermissions;

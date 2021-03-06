import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME} from "../../../../../config/config";
import swal from "sweetalert";
import {Link} from "react-router-dom";

class SectionEditCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category : this.props.location.state.category,
            error : ""
        };
    }

    handleChange = (e) => {
        const value = e.target.value;
        let error = value.length < 3 ? 'نام دسته بندی نمیتواند کمتر از 3 کاراکتر باشد.' : '';
        this.setState(prevState => ({
            error,
            category: {
                ...prevState.category,
                name: value
            }
        }));
    };

    submitData = (e) => {
        e.preventDefault();
        const {category, error} = this.state;
        if (!error.length > 0){
            Axios.post(`${API_ADMIN}/category/${category.slug}/update`,
                {
                    name : category.name ,
                    api_token : localStorage.getItem(APP_TOKEN_NAME)
                },
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "دسته بندی به درستی به روز رسانی شد.", "success")
                        .then(this.props.history.push(`/admin/categories`))
                }else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            }).catch(error => {
                const data = error.response.data.data;
                let errors = Object.keys(data).map((keyName) => {
                    return errors += `${data[keyName][0]}`
                });
                swal("عملیات ناموفق", errors, "error");
            })
        }
    };

    render() {
        const {error, category} = this.state;
        return (
            <div className="mt-3">
                {/*Name*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">نام دسته بندی</label>
                        <input type="text"
                               className={["form-control" , error.length > 0 ? "is-invalid" : ""].join(" ")}
                               name="name"
                               value={category.name}
                               onChange={this.handleChange}
                               placeholder="نام دسته بندی"/>
                        {error.length > 0 &&
                        <span className="text-danger mt-2">{error}</span>}
                    </div>
                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>تکمیل اطلاعات</button>
                <Link className="btn btn-danger ml-2" to="/admin/categories">انصراف</Link>
            </div>
        )
    }
}

export default SectionEditCategory;

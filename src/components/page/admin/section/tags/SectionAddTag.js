import React, {Component} from "react";
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME} from "../../../../../config/config";
import swal from "sweetalert";
import {Link} from "react-router-dom";


class SectionAddTag extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            error: ""
        }
    }

    handleChange = (e) => {
        const {value} = e.target;
        let error = value.length < 3 ? 'نام تگ نمیتواند کمتر از 3 کاراکتر باشد.': '';
        this.setState({error, name: value});
    };

    submitData = (e) => {
        e.preventDefault();
        const {name , error} = this.state;

        if (!error.length > 0){
            Axios.post(`${API_ADMIN}/tag`,
                {
                    name,api_token: localStorage.getItem(APP_TOKEN_NAME)
                },
                {headers: {'Content-Type': 'application/json'}}
            ).then(response => {
                if (response.data.status === "success") {
                    swal("عملیات موفق", "تگ به درستی ثبت شد.", "success")
                        .then(this.props.history.push(`/admin/tags`))
                }
            }).catch(error => {
                const data = error.response.data.data;
                let errors = "";
                Object.keys(data).map((keyName) => {
                    errors += data[keyName][0]
                });
                swal("عملیات ناموفق", errors, "error");
            })
        }
    };

    render() {
        
        const {error} = this.state;
        return (
            <div className="mt-3">
                {/*Name*/}
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">نام تگ</label>
                        <input type="text"
                               className={["form-control" , error.length > 0 ? "is-invalid" : ""].join(" ")}
                               name="name"
                               onChange={this.handleChange}
                               placeholder="نام تگ"/>
                            {error.length > 0 &&
                            <span className="text-danger mt-2">{error}</span>}
                    </div>
                </div>

                {/*Submit*/}
                <button type="submit" className="btn btn-primary" onClick={this.submitData}>تکمیل اطلاعات</button>
                <Link className="btn btn-danger ml-2" to="/admin/tags">انصراف</Link>
            </div>
        )
    }
}

export default SectionAddTag;

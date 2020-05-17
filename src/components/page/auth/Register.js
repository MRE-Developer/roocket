import React, {Component} from "react";
import Axios from "axios";
import {API_ROUTE, APP_TOKEN_NAME, ROUTE_HOME} from "../../../config/config";
import {setIsAuthenticated, setUser} from "../../../actions/userAction";
import store from "../../../store";
import validator from "validator";

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobile: "",
            password: "",
            verifyCode: "",
            code: "",
            errors: {},
            hasError: false,
            isVerify: false,
        };

        if (store.getState().user.isAuthenticated) {
            this.props.history.push(ROUTE_HOME);
        }
    }

    inputHandler = (event) => {
        this.setState({[event.target.id]: event.target.value, errors: {}, hasError: false});
    };

    requestVerifyCode = (e) => {
        e.preventDefault();
        const {mobile, password} = this.state;
        let formError = {};

        //  mobile Validation
        if (validator.isEmpty(mobile) || !validator.isLength(mobile, 11, 11) || !validator.isNumeric(mobile)) {
            formError = {...formError, mobile: ["تلفن همراه وارد شده معتبر نیست."]}
        }

        //  password Validation
        if (validator.isEmpty(password) || !validator.isLength(password, 6)) {
            formError = {...formError, password: ["رمز ورود نباید کمتر از 6 کاراکتر باشد."]}
        }

        if (Object.keys(formError).length > 0) {
            this.setState(state => ({
                ...state,
                errors: formError,
                hasError: true
            }));
        } else {
            Axios.post(API_ROUTE + "/register", {
                mobile: mobile,
                password: password
            }).then((response) => {
                this.setState({code: response.data.data.verifyCode, isVerify: true});
            }).catch((error) => {
                this.setState({errors: error.response.data.data, hasError: true});
            })

        }
    };

    signUp = (e) => {
        e.preventDefault();
        const {verifyCode, mobile} = this.state;
        //  verifyCode Validation
        if (validator.isEmpty(verifyCode) || !validator.isLength(verifyCode, 6, 6) || !validator.isNumeric(verifyCode)) {
            this.setState(state => ({
                ...state,
                errors: {verifyCode: ["کد تایید وارد شده اشتباه است."]},
                hasError: true
            }));
        } else {
            Axios.post(API_ROUTE + "/register/verify",
                {mobile: mobile, verifyCode: verifyCode,}
                ,{headers: {'Content-Type': 'application/json'}}
            ).then((response) => {
                if (response.data.status === "success") {
                    localStorage.setItem(APP_TOKEN_NAME, response.data.data.api_token);
                    store.dispatch(setUser(response.data.data));
                    store.dispatch(setIsAuthenticated(true));
                    this.props.history.push(ROUTE_HOME)
                }
            }).catch((error) => {
                this.setState({errors: error.response.data.data, hasError: true});
            })
        }
    };

    renderErrors = () => {
        const {errors} = this.state;
        const errorItems = Object.keys(errors).map((key, i) => {
            return (
                <li key={i}>
                    <div className="alert alert-danger rtl mb-1">
                        {errors[key][0]}
                    </div>
                </li>
            )
        });
        return <ul className="list-unstyled pl-0">{errorItems}</ul>
    };

    render() {
        const errors = this.renderErrors();
        return (
            <div className="container rtl header-margin">
                <div className="row justify-content-center">
                    <div className="col-4">
                        <form className="form-signin">
                            <h1 className="h3 mb-3 font-weight-normal">ایجاد حساب کاربری</h1>

                            {this.state.hasError ?
                                <div>
                                    {errors}
                                </div>
                                : ""
                            }

                            {
                                this.state.isVerify ?
                                    <div>
                                        <p className="mt-2 text-right">کد تایید</p>
                                        <input id="verifyCode" className="form-control" placeholder="کد تایید"
                                               value={this.state.verifyCode}
                                               onChange={this.inputHandler}/>

                                        <button className="btn btn-lg btn-primary btn-block mt-4" type="submit"
                                                onClick={this.signUp}>ثبت نام
                                        </button>
                                        {this.state.code}

                                    </div>
                                    :
                                    <div>

                                        <p className="mt-4 text-right">موبایل</p>
                                        <input id="mobile" className="form-control" placeholder="شماره تماس" autoFocus
                                               value={this.state.mobile}
                                               onChange={this.inputHandler}
                                        />

                                        <p className="mt-2 text-right">رمز عبور</p>
                                        <input id="password" className="form-control"
                                               placeholder="رمز عبور"
                                               value={this.state.password}
                                               onChange={this.inputHandler}/>

                                        <button className="btn btn-lg btn-primary btn-block mt-4" type="submit"
                                                onClick={this.requestVerifyCode}>درخواست کد تایید
                                        </button>
                                    </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;

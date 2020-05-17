import React, {Component} from "react";
import {API_ROUTE, APP_TOKEN_NAME, ROUTE_HOME, ROUTE_LOGIN} from "../../../config/config";
import Axios from "axios";
import store from "../../../store";
import {removeUser, setIsAuthenticated, setUser} from "../../../actions/userAction";

class UserPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            image: "",
            errors: {},
            success : false,
            hasError: false
        }
    };

    componentDidMount() {
        const api_token = localStorage.getItem(APP_TOKEN_NAME);
        if (api_token != null) {
            Axios.get(`${API_ROUTE}/profile?api_token=${api_token}`,
                {headers: {'Content-Type': 'application/json'}}
            ).then((response) => {
                const user = response.data.data;
                this.setState({user});
                store.dispatch(setUser(user));
                store.dispatch(setIsAuthenticated(true));
            }).catch((error) => {
                if (error.response.status === 401) {
                    localStorage.removeItem(APP_TOKEN_NAME);
                    store.dispatch(removeUser());
                    store.dispatch(setIsAuthenticated(false));
                    this.props.history.push(ROUTE_LOGIN);
                }
            })
        } else {
            store.dispatch(removeUser());
            store.dispatch(setIsAuthenticated(false));
            this.props.history.push(ROUTE_HOME);
        }
    }

    inputHandler = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                [field]: value
            }
            ,success: false
            ,hasError : false
        }))
    };

    changeImage = (event) => {
        this.setState({image: event.target.files[0],success: false,hasError : false});
    };

    handleUpdate = () => {
        const {user, image} = this.state;

        const formDta = new FormData();
        if (image) formDta.append("image", image);
        formDta.append("name", user.name);
        Axios.post(`${API_ROUTE}/profile/update?api_token=${user.api_token}`,
            formDta,
            {headers: {'Content-Type': 'application/json'}}
        ).then(response => {
            if (response.data.status === "success") {
                this.setState({user: response.data.data,success : true, hasError: false});
            }
        }).catch(error => {
            this.setState({errors: error.response.data.data,success : false, hasError: true});
        })
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
        const {user} = this.state;
        return (
            <div>
                {user != null ?
                    <div className="container header-margin rtl">
                        {this.state.success ?
                            <div id="alert" className="alert alert-success alert-dismissible fade show col-6"
                                 role="alert">
                                اطلاعات جدید به درستی ثبت شدند.
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            : ""
                        }

                        {this.state.hasError ?
                            <div className="col-6">
                                {errors}
                            </div>
                            : ""
                        }
                        <div className="row">

                            <div className="col-sm-3">
                                <div>

                                    <img src={`http://localhost:8000${user.image_url}`}
                                         className="avatar img-circle img-thumbnail" alt="avatar"/>

                                    <input type="file" id="image"
                                           className="text-center center-block file-upload mt-2"
                                           onChange={this.changeImage}/>
                                    <button className="btn btn-success mt-3 p-2 btn-block"
                                            onClick={this.handleUpdate}>ذخیره
                                    </button>
                                </div>
                            </div>

                            <div className="col-sm-9">
                                <form className="form" action="##">
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="name"><h4>نام و نام خانوادگی</h4></label>
                                            <input type="text" className="form-control" name="name"
                                                   placeholder="نام و نام خانوادگی"
                                                   onChange={this.inputHandler}
                                                   value={user.name}/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    : ""
                }

            </div>
        )
    }
}

export default UserPanel;

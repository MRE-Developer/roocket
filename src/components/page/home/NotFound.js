import React, {Component} from "react";
import {Link} from "react-router-dom";
import {ROUTE_HOME} from "../../../config/config";

class NotFound extends Component {

    render() {
        return (
            <div>
                <div className="container text-center">
                    <div id="notfound">
                        <div className="notfound">
                            <div className="notfound-404">
                                <h1>404</h1>
                            </div>
                            <h2>اوه! صفحه مورد نظر پیدا نشد.</h2>

                            <Link to={ROUTE_HOME}>صفحه اصلی</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound;

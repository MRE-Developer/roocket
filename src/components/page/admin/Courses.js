import React, {useState, useRef} from 'react';
import {Link, Route, Switch} from "react-router-dom";
import SectionCourses from "./section/courses/SectionCourses";
import SectionAddCourse from "./section/courses/SectionAddCourse";

const Courses = () => {

    const [search, setSearch] = useState("");
    const searchInput = useRef(null);

    const initialSearch= (e) => {
        e.preventDefault();
        setSearch(searchInput.current.value);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                <Link className="navbar-brand" to="/admin/courses">دوره ها</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">

                        {/*{isAllowed("Create-Article") &&*/}
                        <li className="nav-item active">
                            <Link className="nav-link text-primary" to="/admin/courses/create">افزودن دوره</Link>
                        </li>
                        {/*}*/}
                    </ul>

                    <form className="form-inline">
                        <div className="col rtl ">
                            <input type="text"
                                   className="form-control"
                                   ref={searchInput}
                                   placeholder="متن جستجو"/>
                        </div>
                        <div className="col rtl p-0">
                            <button className="btn btn-success" onClick={initialSearch} >جستجو</button>
                        </div>
                    </form>
                </div>
            </nav>

            <Switch>
                <Route exact path="/admin/courses" render={() => <SectionCourses search={search}/>}/>

                {/*{isAllowed("Create-Article") &&*/}
                <Route exact path="/admin/courses/create" component={SectionAddCourse}/>
                {/*}*/}
            </Switch>
        </div>
    )
};

export default Courses
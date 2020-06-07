import React, {useState, useRef} from 'react';
import {Link, Route, Switch} from "react-router-dom";
import SectionEpisodes from "./episodes/SectionEpisodes";
import SectionAddEpisode from "./episodes/SectionAddEpisode";

const Episode = () => {

    const [search, setSearch] = useState("");
    const searchInput = useRef(null);

    const initialSearch= (e) => {
        e.preventDefault();
        setSearch(searchInput.current.value);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-1">
                <Link className="navbar-brand" to="/admin/episodes">ویدیو ها</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">

                        {/*{isAllowed("Create-Article") &&*/}
                        <li className="nav-item active">
                            <Link className="nav-link text-primary" to="/admin/episodes/create">افزودن ویدیو</Link>
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
                <Route exact path="/admin/episodes" render={() => <SectionEpisodes search={search}/>}/>

                {/*{isAllowed("Create-Article") &&*/}
                <Route exact path="/admin/episodes/create" component={SectionAddEpisode}/>
                {/*}*/}
            </Switch>
        </div>
    )
};

export default Episode
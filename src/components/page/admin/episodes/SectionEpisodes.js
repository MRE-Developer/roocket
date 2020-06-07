import React, {useState, useEffect, useRef} from 'react';
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, YOU_SURE} from "../../../../config/config";
import swal from "sweetalert";
import Spinner from "../../../section/Spinner";
import {Link} from "react-router-dom";

const SectionEpisodes = (props) => {
    const [episodes, setEpisodes] = useState([]);

    const fetchData = () => {

        Axios.get(API_ADMIN + `/episodes?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    setEpisodes(response.data.data.data);
                } else {
                    swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
                }
            })
            .catch((error) => {
                swal("عملیات ناموفق", "با عرض پوزش مشکلی پیش آمده است،لطفا بعدا تلاش کنید.", "error");
            });
    };

    useEffect(() => {
        fetchData();
    }, [props.search]);

    //  Delete Article
    const onDelete = (episode) => {
        swal("توجه!!!", YOU_SURE("ویدیو"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/episode/${episode.id}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
                    .then((response) => {
                        if (response.data.status === "success") {
                            swal("عملیات موفق", "ویدیو به درستی حذف شد.", "success");
                            setEpisodes(episodes.filter((itemEpisode) => episode.id !== itemEpisode.id));
                        }
                    })
                    .catch((error) => {
                        swal("عملیات ناموفق", "متاسفانه ویدیو حذف نشد.", "error");
                    });
            }
        });
    };

    return (
        <div>

            {episodes ?
                <table className="table table-striped ">
                    <thead>
                    <tr className="text-right">
                        <th scope="col">شماره</th>
                        <th scope="col">عنوان</th>
                        <th scope="col">دوره</th>
                        <th scope="col">شماره ویدیو</th>
                        <th scope="col">نوع</th>
                        <th scope="col">زمان</th>
                        <th scope="col">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {episodes.map((episode, index) => (
                        <tr key={index} className="text-right">
                            <th>{index + 1}</th>
                            <td><Link to={"/episode/" + episode.id}>{episode.title}</Link></td>
                            <td><Link to={"/course/" + episode.course.slug}>{episode.course.title}</Link></td>
                            <td>{episode.number}</td>
                            <td>{episode.type === "cash" ? "نقدی" : "رایگان"}</td>
                            <td>{episode.time}</td>
                            <td>

                                {/*{isAllowed("Update-Article") &&*/}
                                <Link className="btn btn-primary mr-2"
                                      to={{
                                          pathname: `/admin/course/${episode.course.slug}/episode/${episode.number}/edit`,
                                          state: {
                                              episode: episode
                                          }
                                      }}
                                >ویرایش</Link>
                                {/*}*/}
                                {/*{isAllowed("Delete-Article") &&*/}
                                <button className="btn btn-danger"
                                        onClick={() => onDelete(episode)}>حذف
                                </button>
                                {/*}*/}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                : <Spinner/>}
        </div>
    )
};

export default SectionEpisodes
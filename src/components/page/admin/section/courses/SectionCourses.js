import React, {useState, useEffect, useRef} from 'react';
import Axios from "axios";
import {API_ADMIN, APP_TOKEN_NAME, YOU_SURE} from "../../../../../config/config";
import swal from "sweetalert";
import Spinner from "../../../../section/Spinner";
import {Link} from "react-router-dom";

const SectionCourses = (props) => {
    const [courses, setCourses] = useState([]);

    const fetchData = () => {

        Axios.get(API_ADMIN + `/courses?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
            .then((response) => {
                if (response.data.status === "success") {
                    setCourses(response.data.data.data);
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
    const onDelete = (course) => {
        swal("توجه!!!", YOU_SURE("دوره"), "warning", {
            buttons: ["لغو", "تایید"],
        }).then(value => {
            if (value) {
                Axios.post(API_ADMIN + `/course/${course.slug}/delete?api_token=${localStorage.getItem(APP_TOKEN_NAME)}`)
                    .then((response) => {
                        if (response.data.status === "success") {
                            swal("عملیات موفق", "مقاله به درستی حذف شد.", "success");
                            setCourses(courses.filter((itemCourse) => course.id !== itemCourse.id));
                        }
                    })
                    .catch((error) => {
                        swal("عملیات ناموفق", "متاسفانه دسته بندی حذف نشد.", "error");
                    });
            }
        });
    };

    return (
        <div>
            {courses ?
                <table className="table table-striped ">
                    <thead>
                    <tr className="text-right">
                        <th scope="col">شماره</th>
                        <th scope="col">عنوان</th>
                        <th scope="col">دسته بندی</th>
                        <th scope="col">وضعیت</th>
                        <th scope="col">نوع</th>
                        <th scope="col">قیمت</th>
                        <th scope="col">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course, index) => (
                        <tr key={index} className="text-right">
                            <th>{index + 1}</th>
                            <td><Link to={"/course/" + course.slug}>{course.title}</Link></td>
                            <td><Link to={"/category/" + course.category.slug}>{course.category.name}</Link></td>
                            <td>{course.status === 0 ? "درحال برگزاری" : "تکمیل شده"}</td>
                            <td>{course.type === "cash" ? "نقدی" : course.type === "vip" ? "کاربر ویژه" : "رایگان"}</td>
                            <td>{course.price}</td>
                            <td>

                                {/*{isAllowed("Update-Article") &&*/}
                                <Link className="btn btn-primary mr-2"
                                to={"/admin/course/edit/" + course.slug}>ویرایش</Link>
                                {/*}*/}
                                {/*{isAllowed("Delete-Article") &&*/}
                                <button className="btn btn-danger"
                                onClick={() => onDelete(course)}>حذف</button>
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

export default SectionCourses
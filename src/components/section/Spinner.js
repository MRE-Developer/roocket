import React from 'react';
import spinner from "../../files/spinner.svg"

const Spinner = () => {
    return (
        <img src={spinner}
             style={{width: "100px", margin: "auto" , alignItem : "center", display: "block"}}
             alt="loading..."
        />
    )
};

export default Spinner
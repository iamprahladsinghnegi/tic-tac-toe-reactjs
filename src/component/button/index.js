import React from "react";
import './index.scss';
const CustomButton = ({ handleClick, param, text, type }) => {
    return (
        <button className={`btn-${type}`} onClick={() => handleClick(param)}>
            {text}
        </button>
    )
}
export default CustomButton;
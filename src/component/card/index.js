import React from "react";
import './index.scss';
const CustomCard = ({ children }) => {
    return (
        <div className="card" >
            {children}
        </div>
    )
}
export default CustomCard;
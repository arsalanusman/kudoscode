import React from 'react';
import { Link } from "react-router-dom";

const Button = ({ type,field,title,icon,color,link,isFull }) => {
    return (
        field === 'submit' ? <input className={color + " btn btn-full " + icon + " " + type} type={field} value={title} /> :
        <Link className={color + " button  " + [icon ? icon + " isIcon" : ""]  + [isFull ? ' btn btn-full' : ''] + " " + type} to={link}>{title}</Link>
    );
}

export default Button;


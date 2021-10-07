import React from 'react';
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";

const Logo = ( props ) => {
    return (
        <div className="logo">
        {props.auth ? props.auth.isAuthenticated ?
            <Link to={'/dashboard/'}><img src={logo} width="230" alt="Logo" /></Link>  :  <Link to="/"><img src={logo} width="230" alt="Logo" /></Link>
        :  <Link to="/"><img src={logo} width="230" alt="Logo" /></Link> }
        </div>
    );
}

export default Logo;


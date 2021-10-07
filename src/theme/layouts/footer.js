import React from 'react';
import { Link } from "react-router-dom";

const Footer = ({ state }) => {
    return (
        <footer>
            <div className="container">
                <div className="row">
                     <p style={{textAlign: 'center'}}>Footer Copyright Line | <Link to="/">Footer Menu Links</Link></p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

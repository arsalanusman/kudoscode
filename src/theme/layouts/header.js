import React from 'react';
import Logo from '../components/Logo'
import Navigation from './../components/Navigation'

const Header = ({ nav,auth }) => {
    return (
        <header>
            <div className="container">
                <div className="row navi-column">
                    <div className="column">
                        <Logo auth={auth}/>
                    </div>
                    <Navigation nav={nav} auth={auth}/>
                </div>
            </div>
        </header>
    );
}

export default Header;


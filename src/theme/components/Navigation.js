import React, { useState, useEffect, useRef } from 'react';
import { Link, Redirect  } from "react-router-dom";
import styled from 'styled-components';
import OvalImage from './../assets/Oval-Image.png'
import { Auth } from "aws-amplify";
import { cache } from "swr"

const Navigation = ({ nav,auth }) => {
    const node = useRef();
    const [currentUser,setCurrentUser] = useState(localStorage.getItem('currentUserId'))
    const [signOut,setSignOut] = useState(false)
    const [active,setActive] = useState(false)
    const ActiveDrop = (e) => {
        if(node.current){
            if (node.current.contains(e.target)) {
                // inside click
                return  setActive(true);
            }
            setActive(false)
        }
    }
    const currentUserUpdate = () =>{
        setActive(false)
    }
    const currentUserLogout = () => {
        setActive(false)
    }
    useEffect(()=>{
        // add when mounted
        document.addEventListener("mousedown", ActiveDrop);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", ActiveDrop);
        };
    },[])

    function handleLogout(event){
        event.preventDefault();
        try{
             cache.clear()
            Auth.signOut();
            auth.setAuthStatus(false);
            auth.setUser(null);
            setSignOut(true)
           
        }catch(error){
            console.log(error.message);
        }
    }
    return (
        <>
        {signOut && <Redirect to="/" /> }
        <div className="column">
            <nav>
                <ul>
                    {/*nav.map((item,index)=> item.auth == currentUser && <li key={index} className={item.slug+" menu-item"}><Link to={item.url} className="elementor-item">{item.name}</Link></li> )*/}
                    {/* currentUser == 0 ? <a className="button"  onClick={()=>currentUserUpdate()}>Dashboard</a>:'' */}
                    {auth.isAuthenticated == false ? <Link className="button" to="login">Login  </Link>:''}
                </ul>
            </nav>
        </div>
        {auth && auth.isAuthenticated ?
            <div className="column">
               <Link to={'/dashboard/'} className="button">Dashboard</Link>
                <DropDown  ref={node}>
                    <DropName >Hey, <strong>Michael</strong> <img src={OvalImage} /> </DropName>
                    <Select active={active ? 'active' : ''}>
                        <Option>Profile</Option>
                        <Option>Setting</Option>
                        <Option onClick={(e)=>handleLogout(e)}>Logout</Option>
                    </Select>
                </DropDown>
            </div>
        :''}
        </>
    )
}
export default Navigation;

const DropDown = styled.div`
    position:relative;
    cursor: pointer;
`;

const DropName = styled.div`
    height: 44px;
    min-width: 192px;
    padding: 11px 13px 0px;
    font-weight: 600;
    border-radius: 4px;
    padding-left: 35px;

     :before {
        content: '';
        border: solid black;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 2px;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        float: right;
        margin-top: 7px;
    }
    & img {
        position: absolute;
        margin-top: -8px;
        padding-left:5px;}

`;
const Select = styled.div`
    display:${ props=> props.active ? 'block' : 'none'};
    background: #fff;
    margin-top: 6px;
    border: 1px solid #C2C9D6;
    padding: 0px 0px 0px;
    position: absolute;
    width: 100%;
    z-index:99;
`;

const Option = styled.div`
   padding:4px 8px 4px 8px;
    border-bottom:1px solid #C2C9D6;
    :last-child{
        border:0px;
    }
    :hover {
        background-color: rgba(0,193,202,0.33);
        color: #18223D;
   }
`;


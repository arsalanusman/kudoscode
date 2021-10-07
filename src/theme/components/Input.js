import React from 'react';

const Input = (props) => {
    const handleChange = (x) => {
        if (props.func) {
            props.func(x);
        }
    }
    return (
        <>
        <p className="label">{props.lable} </p>
        <p ><input className={props.icon} type={props.type} id={props.id} placeholder={props.placeholder} onChange={(x)=>handleChange(x)}  /></p>
       </>
    );
}

export default Input;


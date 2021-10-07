import React, { useState } from 'react';

const Switch = ({ title }) => {
    const [checkbox,setCheckbox] = useState(false)
    const switchCheckbox = () =>{
        checkbox === true ?
            setCheckbox(false):setCheckbox(true)
    }
    return (
        <label className="switch" onClick={()=>switchCheckbox()}><input type="checkbox" defaultChecked={checkbox ? 'checked':''}  /><span className="slider round"></span>  {title} </label>
    );
}

export default Switch;


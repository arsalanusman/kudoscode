import React,{useState} from 'react';

const Textarea = (props) => {
    const [value,setValue] = useState()
    const handleChange = (x) => {
        setValue(x.target.value)
    }

    return (
        <>
            <p className="label">{props.lable} </p>
            <p><textarea name={props.message} id={props.id} onChange={handleChange}>{value}</textarea></p>
     </>
    );
}

export default Textarea;


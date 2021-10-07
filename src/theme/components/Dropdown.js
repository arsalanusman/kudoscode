import React,{ useState, useEffect, useRef } from 'react';
import styled from 'styled-components';


const Dropdown = ({data}) => {
    const node = useRef();
    const [active,setActive] = useState(false)
    const [option,setOption] = useState('Select Options')
    const dataOption = data;
    const ActiveDrop = () => {
        setActive(true)
        if(active)
            setActive(false)
    }
    useEffect(()=>{

        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    },[])

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            // inside click
            return  setActive(true);
        }
        setActive(false)
    };
    return (
        <DropDown  ref={node}>
            <DropName className="url-i" >{option}</DropName>
            <Select active={active ? 'active' : ''}>
                {dataOption.map((items,index)=>
                    <Option key={index} onClick={()=>[ setOption(items),setActive(false)]}>{items}</Option>
                )}
            </Select>
        </DropDown>
    );
}

export default Dropdown;

const DropDown = styled.div`
    position:relative;
    cursor: pointer;
`;

const DropName = styled.div`
    border: 1px solid #C2C9D6;
    background-color: #FFF;
    height: 44px;
    padding: 9px 13px 0px;
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

`;
const Select = styled.div`
    display:${ props=> props.active ? 'block' : 'none'};
    background: #fff;
    margin-top: 6px;
    border: 1px solid #C2C9D6;
    padding: 9px 0px 0px;
    color: #57627A;
    position: absolute;
    width: 100%;
    z-index:99;
`;

const Option = styled.div`
   padding: 5px 10px;
   :hover {
        background-color: rgba(0,193,202,0.33);
        color: #18223D;
   }
`;


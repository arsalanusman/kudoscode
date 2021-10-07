import React, { useState, useEffect  } from 'react';
import styled from 'styled-components';

const Checkbox = ({ title, id, status }) => {
    const [checkbox,setCheckbox] = useState(false)
    const switchCheckbox = () =>{
        checkbox === true ?
            setCheckbox(false):setCheckbox(true)
    }
    useEffect(()=>{
        setCheckbox(status)
    },[])
    return (
        <CheckBoxInput className="checkbox" onClick={()=>switchCheckbox()}><input id={id} type="checkbox" defaultChecked={checkbox ? 'checked':''}  /><label>{title}</label><span className={checkbox ? 'checked':''}></span> </CheckBoxInput>
    );
}

export default Checkbox;

const CheckBoxInput = styled.div`

	span {
		&:before {
			content: "";
			display: inline-block;
			background: #fff;
			width: 0;
			height: 0.2rem;
			position: absolute;
			transform-origin: 0% 0%;
			transform: rotate(-55deg);
			top: 1.2rem;
			left: 7px;
		}
		&:after {
			content: "";
			display: inline-block;
			background: #fff;
			width: 0;
			height: 0.2rem;
			position: absolute;
			transform-origin: 0% 0%;
			transform: rotate(35deg);
            bottom: 6px;
            left: 2px;
		}
		display: inline-block;
		width: 1.6rem;
		height: 1.6rem;
		border: 2px solid #ccc;
		position: absolute;
		left: 0;
		transition: all 0.2s;
		z-index: 1;
		box-sizing: content-box;
	}
	position: relative;
	height: 2rem;
	display: flex;
	align-items: center;
	input {
		display: none;
		&:disabled {
			~ {
				span {
					background: #ececec;
					border-color: #dcdcdc;
				}
				label {
					color: #dcdcdc;
					&:hover {
						cursor: default;
					}
				}
			}
		}
	}
	span.checked {
		background: rgb(0, 193, 202);
		border-color: rgb(0, 193, 202);
		&:after {
			width: 0.8rem;
			height: 0.15rem;
			transition: width 0.1s;
			transition-delay: 0.2s;
		}
	}
	label {
		padding-left: 2.5rem;
		position: relative;
		z-index: 2;
		cursor: pointer;
		margin-bottom: 0;
	}
	span.checked {
		&:before {
			width: 1.2rem;
			height: 0.15rem;
			transition: width 0.1s;
			transition-delay: 0.3s;
		}
	}
`
import React from 'react';
import {MdArrowDropDown}  from 'react-icons/md';

import './dropdowns.css';

const Dropdowns=(props)=>{
	return (
		<div className='Dropdown'>
			<button>{props.name}<MdArrowDropDown/></button>
			<ul className='dropdown-content'>
				{props.list.map((ele,idx)=>{
					return <li
						key={ele}
						onClick={()=>props.clicked(ele)}
						style={{
							backgroundColor:props.selected===ele?"#990033":"white",
							color:props.selected===ele?"white":"#990033"
						}}>{ele}</li>
				})}
			</ul>
		</div>
	);
};

export default Dropdowns;
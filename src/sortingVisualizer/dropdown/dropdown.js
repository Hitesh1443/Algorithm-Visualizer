import React from 'react';
//import {MdArrowDropDown}  from 'react-icons/md';

import classes from './dropdown.module.css';

const Dropdown=(props)=>{
	return (
		<div className={classes.Dropdown}>
			<button>{props.name}</button>
			<ul className={classes.DropdownContent}>
				{props.list.map((ele,id)=>{
					return <li 
						key={ele}
						onClick={()=>props.clicked(ele)}
						style={{
							backgroundColor:props.selected===ele?'black':'white',
							color:props.selected===ele?'white':'black'
						}}>{ele}</li>
				})}
			</ul>
		</div>
	);
};

export default Dropdown;
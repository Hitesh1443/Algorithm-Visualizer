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
							backgroundColor:props.selected===ele?'#ff3399':'white',
							color:props.selected===ele?'white':'#ff3399'
						}}>{ele}</li>
				})}
			</ul>
		</div>
	);
};

export default Dropdown;
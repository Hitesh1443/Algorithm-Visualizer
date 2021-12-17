import React from 'react';

import './node.css';

const Node=React.forwardRef((props,ref)=>{
	const {isWall,row,col,isStart,isFinish}=props;
	const extraClass=isWall
		?'node-wall'
		:isStart
		?'nodeStart'
		:isFinish
		?'nodeFinish'
		:'';
	return (
		<div 
			ref={ref}
			className={`Node ${extraClass}`}
			onMouseDown={()=>props.onMouseDown(row,col)}
			onMouseEnter={()=>props.onMouseEnter(row,col)}
			onMouseUp={()=>props.onMouseUp(row,col)}>
		</div>
	);
});

export default Node;

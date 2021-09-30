import React,{useEffect,useState,useCallback} from 'react';
import * as Algos from '../sortingAlgos/sortingAlgos';
import classes from './sortingVisualizer.module.css';
import Dropdown from './dropdown/dropdown';

// #2a2b2dff (black shade) #d9514eff (red shade)

const speedRef={
	'Slow':20,
	'Normal':10,
	'Fast':5
}

const sizeRef={
	'Small':30,
	'Normal':50,
	'Large':80
}

const randomIntFromInterval=(min,max)=>{
	return Math.floor(Math.random()*(max-min+1)+min);
}

const SortingVisualizer=()=>{
	const [array,setArray]=useState([]);
	const [disableButton,setDisable]=useState(false);
	const [speed,setSpeed]=useState('Normal');
	const [size,setSize]=useState('Small');

	const resetArray=useCallback(()=>{
		const temp=[];
		for(let i=0;i<sizeRef[size];++i){
			temp.push(randomIntFromInterval(5,window.screen.height*0.65));
		}
		setArray(temp);
	},[size]);

	useEffect(()=>{
		resetArray();
	},[resetArray])

	const handleSpeed=(val)=>{
		setSpeed(val);
	}
	const handleSize=(val)=>{
		setSize(val);
	}
	const setButtonState=(state)=>{
		setDisable(state);
	}
	const setTempArray=(temp)=>{
		setArray(temp);
	}

	/*const algoChecker=()=>{
		for(let i=1;i<array.length;++i){
			if(array[i]<array[i-1])
				return false;
		}
		return true;
	}*/

	const mergeSort=()=>{
		const [animations,tempArray]=Algos.mergeSort([...array]);
		setButtonState(true);
		setTimeout(()=>{
			setButtonState(false);
			setTempArray(tempArray);
		},animations.length*speedRef[speed]+200);
		//console.log(algoChecker());
		const arrayBars=document.getElementsByClassName(classes.ArrayBar);
		for(let i=0;i<animations.length;i++){
			const isColorChange= i%3 !== 2;
			if(isColorChange){
				const [barOneIdx,barTwoIdx]=animations[i];
				const barOneStyle=arrayBars[barOneIdx].style;
				const barTwoStyle=arrayBars[barTwoIdx].style;
				const color=i%3===0? 'green': 'white';
				setTimeout(()=>{
					barOneStyle.backgroundColor=color;
					barTwoStyle.backgroundColor=color;
				},i*speedRef[speed]);
			} else {
				setTimeout(()=>{
					const [barOneIdx,newHeight]=animations[i];
					const barOneStyle=arrayBars[barOneIdx].style;
					barOneStyle.height=`${newHeight}px`;
				},i*speedRef[speed]);
			}
		}
	}

	const quickSort=()=>{
		
	}

	const heapSort=()=>{
	
	}

	const insertionSort=()=>{
		
	}

	let buttonClasses=[classes.ButtonContain];
	buttonClasses.push(disableButton?classes.Disabled:'');

	return (
		<React.Fragment>
		{disableButton?<div className={classes.Cover}></div>:null}
		<div className={classes.Layout}>
		<h1> Sorting Algorithm Visualizer </h1>
		<div className={buttonClasses.join(' ')}>
			<button disabled={disableButton} onClick={()=>resetArray()}>Generate New Array</button>
			{/*<Dropdown
				name={'Array Size'}
				list={['Small','Normal','Large']}
				clicked={handleSize}
				selected={size}
			/>
			<Dropdown
				name={'Set Speed'}
				list={['Slow','Normal','Fast']}
				clicked={handleSpeed}
				selected={speed}
			/>*/}
			<div className={classes.Sorts}>
				<button disabled={disableButton} onClick={()=>mergeSort()}>Merge Sort</button>
				<button disabled={disableButton} onClick={()=>quickSort()}>Quick Sort</button>
				<button disabled={disableButton} onClick={()=>heapSort()}>Heap Sort</button>
				<button disabled={disableButton} onClick={()=>insertionSort()}>Insertion Sort</button>
			</div>
		</div>
		<div className={classes.ArrayContain}
			style={{
				minHeight:`${window.screen.height*0.65+1}px`
			}}>
			{array.map((val,idx)=>{
				return <div 
					className={classes.ArrayBar} 
					key={idx}
					style={{height:`${val}px`}}>
				</div>
			})}
		</div>
		</div>
		</React.Fragment>
	);
};	

export default SortingVisualizer;
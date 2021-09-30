export const mergeSort=(array)=>{
	const animations=[];
	if(array.length<=1) return array;
	const auxiliaryArray =array.slice();
	mergeSortHelper(array,0,array.length-1,auxiliaryArray,animations);
	return [animations,array];
}

const mergeSortHelper=(
	mainArray,
	startIdx,
	endIdx,
	auxiliaryArray,
	animations
)=>{
	if(startIdx===endIdx) return;
	const middleIdx=Math.floor((startIdx+endIdx)/2);
	mergeSortHelper(auxiliaryArray,startIdx,middleIdx,mainArray,animations);
	mergeSortHelper(auxiliaryArray,middleIdx+1,endIdx,mainArray,animations);
	doMerge(mainArray,startIdx,middleIdx,endIdx,auxiliaryArray,animations);
}

const doMerge=(
	mainArray,
	startIdx,
	middleIdx,
	endIdx,
	auxiliaryArray,
	animations
)=>{
	let k=startIdx;
	let i=startIdx;
	let j=middleIdx+1;
	while(i<=middleIdx && j<=endIdx){
		//We push the indexes we are comparing, to change their color
		animations.push([i,j]);
		//We push it again to revert their color
		animations.push([i,j]);

		if(auxiliaryArray[i]<=auxiliaryArray[j]){
			//We overwrite the value at index k in original array 
			// with value at index i in auxiliaryArray
			animations.push([k,auxiliaryArray[i]]);
			mainArray[k++]=auxiliaryArray[i++];
		} else {
			//We overwrite the value at index k in original array 
			// with value at index j in auxiliaryArray
			animations.push([k,auxiliaryArray[j]]);
			mainArray[k++]=auxiliaryArray[j++];
		}
	}
	while(i<=middleIdx){
		animations.push([i,i]);
		animations.push([i,i]);
		animations.push([k,auxiliaryArray[i]]);
		mainArray[k++]=auxiliaryArray[i++];
	}
	while(j<=endIdx){
		animations.push([j,j]);
		animations.push([j,j]);
		animations.push([k,auxiliaryArray[j]]);
		mainArray[k++]=auxiliaryArray[j++];
	}
}

export const mergeSort = (array) => {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return [animations, array];
};

const mergeSortHelper = (
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  animations
) => {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
};

const doMerge = (
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  animations
) => {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    //We push the indexes we are comparing, to change their color
    animations.push([i, j]);
    //We push it again to revert their color
    animations.push([i, j]);

    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      //We overwrite the value at index k in original array
      // with value at index i in auxiliaryArray
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      //We overwrite the value at index k in original array
      // with value at index j in auxiliaryArray
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    animations.push([i, i]);
    animations.push([i, i]);
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    animations.push([j, j]);
    animations.push([j, j]);
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
};

export const quickSort = (array) => {
  const animations = [];
  if (array.length <= 1) return array;
  quickSortHelper(array, 0, array.length - 1, animations);
  return [animations, array];
};

const quickSortHelper = (mainArray, startIdx, endIdx, animations) => {
  if (startIdx < endIdx) {
    const pIndex = partition(mainArray, startIdx, endIdx, animations);
    quickSortHelper(mainArray, startIdx, pIndex - 1, animations);
    quickSortHelper(mainArray, pIndex + 1, endIdx, animations);
  }
};

const partition = (mainArray, startIdx, endIdx, animations) => {
  const pivot = mainArray[endIdx];
  let pIndex = startIdx;
  for (let i = startIdx; i < endIdx; ++i) {
    // //We push the indexes we are comparing, to change their color
    animations.push(["c", i, endIdx]);
    //We push push it again to revert their color
    animations.push(["c1", i, endIdx]);
    if (mainArray[i] <= pivot) {
      // we push the swap condition with indexes and heights
      animations.push(["s", i, pIndex, mainArray[i], mainArray[pIndex]]);
      [mainArray[i], mainArray[pIndex]] = [mainArray[pIndex], mainArray[i]];
      pIndex++;
    }
  }
  animations.push(["s", pIndex, endIdx, mainArray[pIndex], mainArray[endIdx]]);
  [mainArray[pIndex], mainArray[endIdx]] = [
    mainArray[endIdx],
    mainArray[pIndex],
  ];
  return pIndex;
};

export const insertionSort = (array) => {
  const animations = [];
  for (let i = 1; i < array.length; ++i) {
    const value = array[i];
    let hole = i;
    while (hole > 0 && array[hole - 1] > value) {
      animations.push(["c", hole, i]);
      animations.push(["c1", hole, i]);
      animations.push(["o", hole, array[hole - 1]]);
      array[hole] = array[hole - 1];
      hole--;
    }
    animations.push(["o", hole, value]);
    array[hole] = value;
  }
  return [animations, array];
};

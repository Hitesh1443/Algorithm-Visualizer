import React, { useEffect, useState, useCallback } from "react";
import * as Algos from "../sortingAlgos/sortingAlgos";
import classes from "./sortingVisualizer.module.css";
import Dropdown from "./dropdown/dropdown";

// #2a2b2dff (black shade) #d9514eff (red shade)

const speedRef = {
  Slow: 250,
  Normal: 30,
  Fast: 10,
};

const sizeRef = {
  Small: 30,
  Normal: 50,
  Large: 80,
};

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [disableButton, setDisable] = useState(false);
  const [speed, setSpeed] = useState("Slow");
  const [size, setSize] = useState("Small");

  const resetArray = useCallback(() => {
    const temp = [];
    for (let i = 0; i < sizeRef[size]; ++i) {
      temp.push(randomIntFromInterval(25, window.screen.height * 0.65));
    }
    setArray(temp);
  }, [size]);

  useEffect(() => {
    resetArray();
  }, [resetArray]);

  const handleSpeed = (val) => {
    setSpeed(val);
  };
  const handleSize = (val) => {
    setSize(val);
  };
  const setButtonState = (state) => {
    setDisable(state);
  };
  const setTempArray = (temp) => {
    setArray(temp);
  };

  const sort2func = (type) => {
    let animations, tempArray ;
    if(type === 'quicksort') [animations, tempArray] = Algos.quickSort([...array])
    else if(type === 'heapsort') [animations, tempArray] = Algos.heapSort([...array])
    setButtonState(true);
    setTimeout(() => {
      setButtonState(false);
      setTempArray(tempArray);
    }, animations.length * speedRef[speed] + 200);
    const arrayBars = document.getElementsByClassName(classes.ArrayBar);
    for (let i = 0; i < animations.length; i++) {
      const type = animations[i][0];
      const barOne = arrayBars[animations[i][1]]
      const barTwo = arrayBars[animations[i][2]]
      const barOneStyle = barOne.style;
      const barTwoStyle = barTwo.style;
      if (type === "c" || type === "c1") {
        const color = type === "c" ? "#ff3399" : "#00a3cc";
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * speedRef[speed]);
      } else {
        setTimeout(() => {
          const newOneStyle = animations[i][4];
          const newTwoStyle = animations[i][3];
          if(!!barOne.children[0]){
            barOne.children[0].childNodes[0].data = newOneStyle
            barTwo.children[0].childNodes[0].data = newTwoStyle
          }
          barOneStyle.height = `${newOneStyle}px`;
          barOneStyle.transition = 'height 0.2s ease-out'
          barTwoStyle.height = `${newTwoStyle}px`;
          barTwoStyle.transition = 'height 0.2s ease-out'
        }, i * speedRef[speed]);
      }
    }
  }

  const sort1func = (type) => {
    let animations, tempArray ;
    if(type === 'mergesort') [animations, tempArray] = Algos.mergeSort([...array])
    else if(type === 'insertionsort') [animations, tempArray] = Algos.insertionSort([...array])
    console.log(animations);
    setButtonState(true);
    setTimeout(() => {
      setButtonState(false);
      setTempArray(tempArray);
    }, animations.length * speedRef[speed] + 200);
    const arrayBars = document.getElementsByClassName(classes.ArrayBar);
    for (let i = 0; i < animations.length; i++) {
      const type = animations[i][0];
      if (type === "c" || type === "c1") {
        const barOneStyle = arrayBars[animations[i][1]].style;
        const barTwoStyle = arrayBars[animations[i][2]].style;
        const color = type === "c" ? "#ff3399" : "#00a3cc";
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * speedRef[speed]);
      } else {
        setTimeout(() => {
          const barOne = arrayBars[animations[i][1]]
          const barOneStyle = barOne.style
          const newHeight = animations[i][2]
          if(!!barOne.children[0])
            barOne.children[0].childNodes[0].data = newHeight
          barOneStyle.height = `${newHeight}px`
          barOneStyle.transition = 'height 0.2s ease-out'
        }, i * speedRef[speed]);
      }
    }
  };

  let buttonClasses = [classes.ButtonContain];
  buttonClasses.push(disableButton ? classes.Disabled : "");

  return (
    <React.Fragment>
      {disableButton ? <div className={classes.Cover}></div> : null}
      <div className={classes.Layout}>
        <div className={buttonClasses.join(" ")}>
          <button disabled={disableButton} onClick={() => resetArray()}>
            Generate New Array
          </button>
          <Dropdown
            name={"Array Size"}
            list={["Small", "Normal", "Large"]}
            clicked={handleSize}
            selected={size}
          />
          <Dropdown
            name={"Set Speed"}
            list={["Slow", "Normal", "Fast"]}
            clicked={handleSpeed}
            selected={speed}
          />
          <div className={classes.Sorts}>
            <button disabled={disableButton} onClick={() => sort1func('mergesort')}>
              Merge Sort
            </button>
            <button disabled={disableButton} onClick={() => sort2func('quicksort')}>
              Quick Sort
            </button>
            <button disabled={disableButton} onClick={() => sort2func('heapsort')}>
              Heap Sort
            </button>
            <button disabled={disableButton} onClick={() => sort1func('insertionsort')}>
              Insertion Sort
            </button>
          </div>
        </div>
        <div
          className={classes.ArrayContain}
          style={{
            minHeight: `${window.screen.height * 0.65 + 1}px`,
          }}
        >
          {array.map((val, idx) => {
            return (
              <div
                className={classes.ArrayBar}
                key={idx}
                style={{ height: `${val}px` }}
              >{size === 'Small'?<p>{val}</p>:null}</div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SortingVisualizer;

import React, { useState } from "react";

import SortingVisualizer from "./sorting/sortingVisualizer/sortingVisualizer";

import PathFindingVisualizer from "./pathFinding/visualizer/visualizer";

import "./App.css";

const App = (props) => {
  const [render, setrender] = useState(0);
  
  const changeRender = (x) => {
    if(render!==x) setrender(x)
  }

  return (
    <React.Fragment>
      <div className="Header">
        <h1 onClick={()=>changeRender(0)}
            style={{color:render===0?'#ffb366':'white'}}> Sorting Algorithm Visualizer</h1>
        <h1>|</h1>
        <h1 onClick={()=>changeRender(1)}
            style={{color:render===1?'#ffb366':'white'}}> PathFinding Visualizer </h1>
      </div>
      {render===0?<SortingVisualizer/>:<PathFindingVisualizer/>}
    </React.Fragment>
  )
};

export default App;

import React, { useState, useEffect } from "react";

import "./visualizer.css";
import Node from "./node/node";
import Dropdowns from "./dropdowns/dropdowns";
import { astar, astarShortestPath } from "../algorithms/aStar";
import { dijkstra, dijkstraShortestPath } from "../algorithms/dijkstra";
import { dfs, dfsShortestPath } from "../algorithms/dfs";
import { biBfs, biBfsShortestPath } from "../algorithms/biBfs";
import { maze1, maze2, maze3 } from "./mazes.js";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 12;

const speedRef = {
  Slow: 17,
  Normal: 12,
  Fast: 6,
};

const refs2D = [...Array(47)].map((e) => Array(21));

const Visualizer = () => {
  const [mainGrid, setMainGrid] = useState([]);
  const [wallList, setWallList] = useState([]);
  const [mazeState, setMazeState] = useState("");
  const [algo, setAlgo] = useState("Dijkstra");
  const [mouseWall, setMouseWall] = useState(false);
  const [mouseSNode, setMouseSNode] = useState(false);
  const [mouseFNode, setMouseFNode] = useState(false);
  const [startNodeMain, setStartNode] = useState({ row: 10, col: 15 });
  const [endNodeMain, setEndNode] = useState({ row: 15, col: 12 });
  const [algoState, setAlgoState] = useState(0);
  const [speed, setSpeed] = useState("Normal");
  const ns = refs2D[START_NODE_ROW][START_NODE_COL];
  const ne = refs2D[FINISH_NODE_ROW][FINISH_NODE_COL];
  useEffect(() => {
    if (!!refs2D[START_NODE_ROW][START_NODE_COL]) {
      refs2D[START_NODE_ROW][START_NODE_COL].className += " nodeStart";
    }
    if (!!refs2D[FINISH_NODE_ROW][FINISH_NODE_COL])
      refs2D[FINISH_NODE_ROW][FINISH_NODE_COL].className += " nodeFinish";
  }, [ns, ne]);

  useEffect(() => {
    const temp = getGrid(startNodeMain, endNodeMain, wallList);
    setMainGrid(temp);
  }, [startNodeMain, endNodeMain, wallList]);

  const handleAlgoState = (state) => {
    if (state === 1) {
      clearColors();
    }
    setAlgoState(state);
  };
  const handleMainGrid = (grid) => {
    setMainGrid(grid);
  };
  const handleAlgo = (name) => {
    setAlgo(name);
  };
  const handleMaze = (pattern) => {
    switch (pattern) {
      case "Maze 1":
        clearColors();
        handleWallListState(maze1);
        handleSNode(1, 1);
        handleFNode(45, 19);
        setMazeState("Maze 1");
        break;
      case "Maze 2":
        clearColors();
        handleWallListState(maze2);
        handleSNode(1, 1);
        handleFNode(45, 1);
        setMazeState("Maze 2");
        break;
      case "Maze 3":
        clearColors();
        handleWallListState(maze3);
        handleSNode(0, 0);
        handleFNode(46, 0);
        setMazeState("Maze 3");
        break;
      default:
        setMazeState("");
        return;
    }
  };
  const handleSpeed = (val) => {
    setSpeed(val);
  };
  const handleMouseWall = (state) => {
    setMouseWall(state);
  };
  const handleSNode = (row, col) => {
    setStartNode({ row: row, col: col });
  };
  const handleFNode = (row, col) => {
    setEndNode({ row: row, col: col });
  };
  const handleMouseSNode = (state) => {
    setMouseSNode(state);
  };
  const handleMouseFNode = (state) => {
    setMouseFNode(state);
  };
  const handleWallListState = (list) => {
    setWallList(list);
  };

  const handleMouseEnter = (row, col) => {
    if (mouseSNode || mouseFNode) {
      const idx = wallList.find((wall) => {
        return wall.row === row && wall.col === col;
      });
      if (!!idx) {
        return;
      }
    }

    if (mouseSNode) {
      for (let i = 0; i < refs2D.length; ++i) {
        let f = false;
        for (let j = 0; j < refs2D[0].length; ++j) {
          if (refs2D[i][j].className.search("nodeStart") > -1) {
            let str = refs2D[i][j].className;
            str = str.replace(/nodeStart/gi, "");
            refs2D[i][j].className = str;
            refs2D[row][col].className += " nodeStart";
            f = true;
            break;
          }
          if (f) break;
        }
      }
    } else if (mouseFNode) {
      for (let i = 0; i < refs2D.length; ++i) {
        let f = false;
        for (let j = 0; j < refs2D[0].length; ++j) {
          if (refs2D[i][j].className.search("nodeFinish") > -1) {
            let str = refs2D[i][j].className;
            str = str.replace(/nodeFinish/gi, "");
            refs2D[i][j].className = str;
            refs2D[row][col].className += " nodeFinish";
            f = true;
            break;
          }
          if (f) break;
        }
      }
    } else if (mouseWall) {
      if (row === startNodeMain.row && col === startNodeMain.col) return;
      if (row === endNodeMain.row && col === endNodeMain.col) return;
      if (refs2D[row][col].className.search("node-wall") > -1) {
        let str = refs2D[row][col].className;
        str = str.replace(/node-wall/gi, "");
        refs2D[row][col].className = str;
      } else {
        refs2D[row][col].className += " node-wall";
      }
    }
    if (algoState === 2 && mouseSNode) {
      visualizeDrag({ row: row, col: col }, endNodeMain);
      return;
    }
    if (algoState === 2 && mouseFNode) {
      visualizeDrag(startNodeMain, { row: row, col: col });
      return;
    }
  };

  const handleMouseUp = (row, col) => {
    let counter = false;
    if (mouseSNode || mouseFNode) {
      const idx = wallList.find((wall) => {
        return wall.row === row && wall.col === col;
      });
      if (!!idx) {
        counter = true;
        if (mouseSNode) {
          for (let i = 0; i < refs2D.length; ++i) {
            let flag = false;
            for (let j = 0; j < refs2D[0].length; ++j) {
              if (refs2D[i][j].className.search("nodeStart") > -1) {
                handleSNode(i, j);
                handleMouseSNode(false);
                flag = true;
                break;
              }
            }
            if (flag) break;
          }
        }
        if (mouseFNode) {
          for (let i = 0; i < refs2D.length; ++i) {
            let flag = false;
            for (let j = 0; j < refs2D[0].length; ++j) {
              if (refs2D[i][j].className.search("nodeFinish") > -1) {
                handleFNode(i, j);
                handleMouseFNode(false);
                flag = true;
                break;
              }
            }
            if (flag) break;
          }
        }
      }
    }
    if (!counter && mouseSNode) {
      handleSNode(row, col);
      handleMouseSNode(false);
    } else if (!counter && mouseFNode) {
      handleFNode(row, col);
      handleMouseFNode(false);
    } else if (mouseWall) {
      const newWallList = [];
      for (let row = 0; row < refs2D.length; ++row) {
        for (let col = 0; col < refs2D[0].length; ++col) {
          if (refs2D[row][col].className.search("node-wall") > -1) {
            newWallList.push({ row, col });
          }
        }
      }
      handleWallListState(newWallList);
      handleMouseWall(false);
    }
    const newGrid = getGrid(startNodeMain, endNodeMain, wallList);
    handleMainGrid(newGrid);
  };

  const handleMouseDown = (row, col) => {
    if (row === startNodeMain.row && col === startNodeMain.col) {
      handleMouseSNode(true);
      return;
    }
    if (row === endNodeMain.row && col === endNodeMain.col) {
      handleMouseFNode(true);
      return;
    }
    if (algoState === 2) return;
    handleMouseWall(true);
    if (refs2D[row][col].className.search("node-wall") > -1) {
      let str = refs2D[row][col].className;
      str = str.replace(/node-wall/gi, "");
      refs2D[row][col].className = str;
    } else {
      refs2D[row][col].className += " node-wall";
    }
  };

  const clearBoard = () => {
    console.log(wallList);
    clearColors();
    const grid = getGrid(startNodeMain, endNodeMain, []);
    setMazeState("");
    setMainGrid(grid);
    setAlgoState(0);
    setWallList([]);
  };

  const clearColors = () => {
    for (let row = 0; row < mainGrid.length; ++row) {
      for (let col = 0; col < mainGrid[0].length; ++col) {
        let str = refs2D[row][col].className;
        str = str.replace(/node-visited/gi, "");
        str = str.replace(/node-shortestPath/gi, "");
        str = str.replace(/node-visited-stay/gi, "");
        str = str.replace(/node-shortestPath-stay/gi, "");
        refs2D[row][col].className = str;
      }
    }
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPath) => {
    for (let i = 0; i <= visitedNodesInOrder.length; ++i) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPath);
        }, speedRef[speed] * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        refs2D[node.row][node.col].className += " node-visited";
      }, speedRef[speed] * i);
    }
  };

  const animateShortestPath = (nodesInShortestPath) => {
    for (let i = 0; i < nodesInShortestPath.length; ++i) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        refs2D[node.row][node.col].className += " node-shortestPath";
      }, 10 * i);
    }
  };

  const visualizeDijkstra = () => {
    const grid = [...Array(mainGrid.length)].map((e) =>
      Array(mainGrid[0].length)
    );
    for (let row = 0; row < mainGrid.length; ++row) {
      for (let col = 0; col < mainGrid[0].length; ++col) {
        grid[row][col] = { ...mainGrid[row][col], fDist: Infinity };
      }
    }
    const startNode = grid[startNodeMain.row][startNodeMain.col];
    const finishNode = grid[endNodeMain.row][endNodeMain.col];
    let visitedNodesInOrder = [];
    let nodesInShortestPath = [];
    switch (algo) {
      case "Dijkstra":
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        nodesInShortestPath = dijkstraShortestPath(finishNode);
        break;
      case "A* search":
        visitedNodesInOrder = astar(grid, startNode, finishNode);
        nodesInShortestPath = astarShortestPath(finishNode);
        break;
      case "DFS":
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        nodesInShortestPath = dfsShortestPath(finishNode);
        break;
      case "Bidirectional BFS":
        visitedNodesInOrder = biBfs(grid, startNode, finishNode);
        const interNode = visitedNodesInOrder[visitedNodesInOrder.length - 1];
        console.log(interNode);
        nodesInShortestPath = biBfsShortestPath(interNode);
        break;
      default:
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        nodesInShortestPath = dijkstraShortestPath(finishNode);
    }
    handleAlgoState(1);
    setTimeout(() => {
      handleAlgoState(2);
    }, visitedNodesInOrder.length * speedRef[speed] + nodesInShortestPath.length * 10 + 1000);

    if (!!visitedNodesInOrder)
      animateDijkstra(visitedNodesInOrder, nodesInShortestPath);
    else console.log("Something wrong!");
  };

  const visualizeDrag = (startNode, endNode) => {
    clearColors();
    const grid = [...Array(mainGrid.length)].map((e) =>
      Array(mainGrid[0].length)
    );
    for (let row = 0; row < mainGrid.length; ++row) {
      for (let col = 0; col < mainGrid[0].length; ++col) {
        grid[row][col] = { ...mainGrid[row][col], fDist: Infinity };
      }
    }
    const startingNode = grid[startNode.row][startNode.col];
    const finishNode = grid[endNode.row][endNode.col];
    let visitedNodesInOrder;
    let nodesInShortestPath;
    switch (algo) {
      case "Dijkstra":
        visitedNodesInOrder = dijkstra(grid, startingNode, finishNode);
        nodesInShortestPath = dijkstraShortestPath(finishNode);
        break;
      case "A* search":
        visitedNodesInOrder = astar(grid, startingNode, finishNode);
        nodesInShortestPath = astarShortestPath(finishNode);
        break;
      case "DFS":
        visitedNodesInOrder = dfs(grid, startingNode, finishNode);
        nodesInShortestPath = dfsShortestPath(finishNode);
        break;
      case "Bidirectional BFS":
        visitedNodesInOrder = biBfs(grid, startNode, finishNode);
        const interNode = visitedNodesInOrder[visitedNodesInOrder.length - 1];
        nodesInShortestPath = biBfsShortestPath(interNode);
        break;
      default:
        visitedNodesInOrder = dijkstra(grid, startingNode, finishNode);
        nodesInShortestPath = dijkstraShortestPath(finishNode);
    }
    for (let i = 0; i < visitedNodesInOrder.length; ++i) {
      const node = visitedNodesInOrder[i];
      refs2D[node.row][node.col].className += " node-visited-stay";
    }
    for (let i = 0; i < nodesInShortestPath.length; ++i) {
      const node = nodesInShortestPath[i];
      refs2D[node.row][node.col].className += " node-shortestPath-stay";
    }
  };
  return (
    <React.Fragment>
      {algoState === 1 ? <div className="cover"></div> : null}
      <div className="Functions">
        <Dropdowns
          name={"Algorithms"}
          list={["Dijkstra", "A* search", "DFS", "Bidirectional BFS"]}
          clicked={handleAlgo}
          selected={algo}
        />
        <Dropdowns
          name={"Mazes"}
          list={["Maze 1", "Maze 2", "Maze 3"]}
          clicked={handleMaze}
          selected={mazeState}
        />
        <button onClick={visualizeDijkstra}>Visualize {algo}</button>
        <button onClick={clearBoard}>Clear Board</button>
        <button
          onClick={() => {
            clearColors();
            setAlgoState(0);
          }}
        >
          Clear Path
        </button>
        <Dropdowns
          name={"Speed"}
          list={["Slow", "Normal", "Fast"]}
          clicked={handleSpeed}
          selected={speed}
        />
      </div>
      <br />
      <div className="Grid">
        {mainGrid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isStart, isFinish, isWall } = node;
                return (
                  <Node
                    ref={(el) => (refs2D[row][col] = el)}
                    key={nodeIdx}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={(row, col) => handleMouseUp(row, col)}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

const getGrid = (startNode, endNode, wallList) => {
  const grid = [];
  for (let row = 0; row < 47; ++row) {
    const currRow = [];
    for (let col = 0; col < 21; ++col) {
      currRow.push(createNode(col, row, startNode, endNode));
    }
    grid.push(currRow);
  }
  for (const wall of wallList) {
    grid[wall.row][wall.col].isWall = true;
  }
  return grid;
};

const createNode = (col, row, startNode, endNode) => {
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === endNode.row && col === endNode.col,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

export default Visualizer;

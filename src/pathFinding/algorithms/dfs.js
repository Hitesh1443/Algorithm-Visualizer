
export const dfs = (grid,startNode,finishNode) => {
    const visitOrder = []
    recur(grid,startNode,visitOrder,finishNode)
    return visitOrder
}

const recur = (grid,node,visitOrder,finishNode) => {
    node.isVisited = true
    visitOrder.push(node)
    if(node===finishNode) return true
    const neighbors = getNeighbors(node,grid)
    for(const neighbor of neighbors){
        neighbor.previousNode = node
        const flag = recur(grid,neighbor,visitOrder,finishNode)
        if(flag) return true
    }
    return false
}

const getNeighbors = (node,grid) => {
	const neighbors=[]
	const {col,row}=node
	if(row>0) neighbors.push(grid[row-1][col])
	if(row<grid.length-1) neighbors.push(grid[row+1][col])
	if(col>0) neighbors.push(grid[row][col-1])
	if(col<grid[0].length-1) neighbors.push(grid[row][col+1])
	return neighbors.filter(neighbor=>!neighbor.isVisited && !neighbor.isWall)
}

export const dfsShortestPath = (finishNode) =>{
    const nodesInShortestPath = []
    let currentNode = finishNode
    while(currentNode!==null){
        nodesInShortestPath.unshift(currentNode)
        currentNode = currentNode.previousNode
    }
    return nodesInShortestPath
}
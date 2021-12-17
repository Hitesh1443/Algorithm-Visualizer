
export const biBfs = (grid,startNode,finishNode) => {
    prep(grid)
    const startQueue = []
    const finishQueue = []
    const visitOrder = []
    startQueue.push(startNode)
    finishQueue.push(finishNode)
    startNode.isVisited = true
    finishNode.visited = true

    while(!!startQueue.length && !!finishQueue.length){
        bfs(startQueue,visitOrder,1,grid)
        bfs(finishQueue,visitOrder,2,grid)

        const interNode = intersect(grid)

        if(interNode!==null){
            visitOrder.push(interNode)
            break
        }
    }
    return visitOrder
}

const bfs = (queue,visitOrder,flag,grid) => {
    const node = queue.shift()
    visitOrder.push(node)
    const neighbors = getNeighbors(node,grid,flag)
    for(const neighbor of neighbors){
        if(flag===1) neighbor.isVisited = true
        else neighbor.visited = true
        if(flag===1) neighbor.previousNode = node
        else neighbor.previousNode2 = node 
        queue.push(neighbor)
    }
}

const getNeighbors = (node,grid,flag) => {
	const neighbors=[]
	const {col,row}=node
	if(row>0) neighbors.push(grid[row-1][col])
	if(row<grid.length-1) neighbors.push(grid[row+1][col])
	if(col>0) neighbors.push(grid[row][col-1])
	if(col<grid[0].length-1) neighbors.push(grid[row][col+1])
	//neighbors.filter(neighbor=>!neighbor.isWall)
    if(flag===1) return neighbors.filter(neighbor=>!neighbor.isVisited && !neighbor.isWall)
    return neighbors.filter(neighbor=>!neighbor.visited && !neighbor.isWall)
}

const prep = (grid) => {
    for(const row of grid){
        for(const node of row) node.visited = false
    }
}

const intersect = (grid) => {
    for(const row of grid){
        for(const node of row){
            if(node.visited && node.isVisited) return node
        }
    }
    return null
}

export const biBfsShortestPath = (interNode) => {
    const shortestPath = []
    let currentNode = interNode
    while(!!currentNode){
        shortestPath.push(currentNode)
        currentNode = currentNode.previousNode2
    }
    currentNode = interNode
    while(!!currentNode){
        shortestPath.unshift(currentNode)
        currentNode = currentNode.previousNode
    }
    return shortestPath
}
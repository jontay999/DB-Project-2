function updateNodeInfo(nodeInfo) {
    const nodeTitle = document.getElementById("nodeTitle")
    const secondaryContent = document.getElementById("secondaryContent")
    const widthInfo = document.getElementById("widthInfo")
    const costInfo = document.getElementById("costInfo")
    const depthInfo = document.getElementById("depthInfo")
    const rowInfo = document.getElementById("rowInfo")

    nodeTitle.textContent = nodeInfo.title;
    // cady to take note that secondary content is an array so render it appropriately if got multiple lines
    secondaryContent.textContent = nodeInfo.secondary_content[0];
    widthInfo.textContent = nodeInfo.width;
    costInfo.textContent = `(${nodeInfo.cost[0]}, ${nodeInfo.cost[1]})`;
    depthInfo.textContent = nodeInfo.depth;
    rowInfo.textContent = nodeInfo.rows;
}

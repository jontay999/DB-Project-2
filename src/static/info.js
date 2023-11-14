function updateNodeInfo(nodeInfo) {
  // save elements to variables
  const nodeTitle = document.getElementById("nodeTitle");
  const secondaryContent = document.getElementById("secondaryContent");
  const widthInfo = document.getElementById("widthInfo");
  const costInfo = document.getElementById("costInfo");
  const depthInfo = document.getElementById("depthInfo");
  const rowInfo = document.getElementById("rowInfo");
  const blocksAccessedDiv = document.getElementById("blocksAccessedDiv");
  const blocksAccessedInfo = document.getElementById("blocksAccessedInfo");
  const blocksAccessedButton = document.getElementById("blocksAccessedButton");
  const nodeInfoDiv = document.getElementById("nodeInfo");
  const nodeInfoPlaceholder = document.getElementById("nodeInfo_placeholder");
  // update the elements when a node is clicked
  nodeTitle.textContent = nodeInfo.title;
  nodeInfoDiv.style.display = "block";
  nodeInfoPlaceholder.style.display = "none";
  secondaryContent.textContent = nodeInfo.secondary_content[0];
  widthInfo.textContent = nodeInfo.width;
  costInfo.textContent = `(${nodeInfo.cost[0]}, ${nodeInfo.cost[1]})`;
  depthInfo.textContent = nodeInfo.depth;
  rowInfo.textContent = nodeInfo.rows;
  // remove additional div for "Blocks and Tuples Accessed By the Query"
  blocksAccessedDiv.style.display = "none";
  blocksAccessedInfo.style.display = "block";
  // If the node info content does not have a table, it means we cannot display the blocks accessed info
  if (nodeInfo.table === null) {
    blocksAccessedInfo.textContent = "N.A.";
    blocksAccessedButton.style.display = "none";
    // If the node info content has a table, it means we can display the blocks accessed info and we set the button to visible
  } else {
    blocksAccessedInfo.textContent = "";
    blocksAccessedButton.style.display = "block";
  }
}

function updateNodeInfo(nodeInfo) {
  const nodeTitle = document.getElementById("nodeTitle");
  const secondaryContent = document.getElementById("secondaryContent");
  const widthInfo = document.getElementById("widthInfo");
  const costInfo = document.getElementById("costInfo");
  const depthInfo = document.getElementById("depthInfo");
  const rowInfo = document.getElementById("rowInfo");
  const blocksAccessed = document.getElementById("blocksAccessed");
  const blocksAccessedInfo = document.getElementById("blocksAccessedInfo");
  const blocksAccessedButton = document.getElementById("blocksAccessedButton");
  nodeTitle.textContent = nodeInfo.title;
  // cady to take note that secondary content is an array so render it appropriately if got multiple lines
  secondaryContent.textContent = nodeInfo.secondary_content[0];
  widthInfo.textContent = nodeInfo.width;
  costInfo.textContent = `(${nodeInfo.cost[0]}, ${nodeInfo.cost[1]})`;
  depthInfo.textContent = nodeInfo.depth;
  rowInfo.textContent = nodeInfo.rows;
  if (nodeInfo.table === null) {
    blocksAccessedInfo.innerHTML = "<b>Blocks Accessed:</b> N.A.";
    blocksAccessedButton.style.display = "none";
    blocksAccessed.style.display = "none";
  } else {
    blocksAccessedInfo.innerHTML = `<b>Blocks Accessed:</b>`;
    blocksAccessedButton.style.display = "block";
    blocksAccessed.style.display = "block";
  }
  //   else {
  //     const button = document.createElement("button");
  //     button.textContent = "View Blocks and Tuples Accessed";
  //     blocksAccessedInfo.textContent = ""; // clear the span
  //     blocksAccessedInfo.appendChild(button); // append the button to the span
  //   }
}

const treeData = {
    id: "A",
    children: [
        { id: "B" },
        {
            id: "C",
            children: [
                { id: "D" },
                { id: "E" },
            ],
        },
    ],
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawTree(node, x, y) {
    // Draw the node as a rectangle
    ctx.strokeRect(x - 20, y - 10, 40, 20);
    // Draw the text content (ID) in the center of the rectangle
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id, x, y);

    // Calculate the horizontal position for child nodes
    if (!node.children) return;
    let childX = x - (node.children.length - 1) * 30;
    let childY = y + 60;

    // Recursively draw child nodes
    for (const child of node.children) {
        drawTree(child, childX, childY);
        childX += 60;
    }

}

let scaleLevel = 1
canvas.addEventListener("wheel", (event) => {

    const zoomFactor = 1.01
    event.preventDefault();
    const zoomDirection = event.deltaY < 0 ? 1 : -1;
    scaleLevel *= Math.pow(zoomFactor, zoomDirection);
    // Clear the canvas and apply the new scale
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scaleLevel, 0, 0, scaleLevel, 0, 0);

    canvas.width *= scale;
    canvas.height *= scale;
    ctx.scale(scale, scale);

    // Redraw the tree
    drawTree(treeData, canvas.width / 2, 30);
});

// Start drawing from the root node
drawTree(treeData, canvas.width / 2, 30);
const ctx = canvas.getContext("2d");
// requestAnimationFrame(update);
const mouse = { x: 0, y: 0, button: false, wheel: 0, lastX: 0, lastY: 0, drag: false };
const gridLimit = 64;  // max grid lines for static grid
const gridSize = 128;  // grid size in screen pixels for adaptive and world pixels for static
const scaleRate = 1.02; // Closer to 1 slower rate of change
const topLeft = { x: 0, y: 0 };  // holds top left of canvas in world coords.

const canvasDiv = document.getElementById("canvas-div");
function mouseEvents(e) {
    if (e.target !== canvas) return;
    const bounds = canvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - scrollX;
    mouse.y = e.pageY - bounds.top - scrollY;
    mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
    if (e.type === "wheel") {
        mouse.wheel += -e.deltaY;
        e.preventDefault();
    }
}
["mousedown", "mouseup", "mousemove"].forEach(name => document.addEventListener(name, mouseEvents));
// document.addEventListener("wheel", mouseEvents, { passive: false });

const panZoom = {
    x: 0,
    y: 0,
    scale: 1 / 5,
    maxScale: 1,
    minScale: 1 / 5,
    apply() { ctx.setTransform(this.scale, 0, 0, this.scale, this.x, this.y) },
    scaleAt(x, y, sc) {  // x & y are screen coords, not world
        this.scale *= sc;
        if (this.scale < this.minScale) this.scale = this.minScale;
        if (this.scale > this.maxScale) this.scale = this.maxScale;
        this.x = x - (x - this.x) * sc;
        this.y = y - (y - this.y) * sc;
    },
    toWorld(x, y, point = {}) {   // converts from screen coords to world coords
        const inv = 1 / this.scale;
        point.x = (x - this.x) * inv;
        point.y = (y - this.y) * inv;
        return point;
    },
}
function drawGrid(gridScreenSize = 128, adaptive = true) {
    var scale, gridScale, size, x, y, limitedGrid = false;
    if (adaptive) {
        scale = 1 / panZoom.scale;
        gridScale = 2 ** (Math.log2(gridScreenSize * scale) | 0);
        size = Math.max(w, h) * scale + gridScale * 2;
        x = ((-panZoom.x * scale - gridScale) / gridScale | 0) * gridScale;
        y = ((-panZoom.y * scale - gridScale) / gridScale | 0) * gridScale;
    } else {
        gridScale = gridScreenSize;
        size = Math.max(w, h) / panZoom.scale + gridScale * 2;
        panZoom.toWorld(0, 0, topLeft);
        x = Math.floor(topLeft.x / gridScale) * gridScale;
        y = Math.floor(topLeft.y / gridScale) * gridScale;
        if (size / gridScale > gridLimit) {
            size = gridScale * gridLimit;
            limitedGrid = true;
        }
    }
    panZoom.apply();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#afafaf";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (i = 0; i < size; i += gridScale) {
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + i, y + size);
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + size, y + i);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the transform so the lineWidth is 1
    ctx.stroke();
    ctx.globalAlpha = 1;
}
function drawPoint(x, y) {
    const worldCoord = panZoom.toWorld(x, y);
    panZoom.apply();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(worldCoord.x - 10, worldCoord.y);
    ctx.lineTo(worldCoord.x + 10, worldCoord.y);
    ctx.moveTo(worldCoord.x, worldCoord.y - 10);
    ctx.lineTo(worldCoord.x, worldCoord.y + 10);
    ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the transform so the lineWidth is 1
    ctx.stroke();
}

var w = canvas.width;
var h = canvas.height;
function update() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.globalAlpha = 1;           // reset alpha
    if (w !== innerWidth || h !== innerHeight) {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
    } else {
        ctx.clearRect(0, 0, w, h);
    }

    drawTree(tree)

    if (mouse.wheel !== 0) {
        let scale = 1;
        scale = mouse.wheel < 0 ? 1 / scaleRate : scaleRate;
        mouse.wheel *= 0.8;
        if (Math.abs(mouse.wheel) < 1) {
            mouse.wheel = 0;
        }
        panZoom.scaleAt(mouse.x, mouse.y, scale); //scale is the change in scale
    }
    if (mouse.button) {
        if (!mouse.drag) {
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
            mouse.drag = true;
        } else {
            panZoom.x += mouse.x - mouse.lastX;
            panZoom.y += mouse.y - mouse.lastY;
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
        }
    } else if (mouse.drag) {
        mouse.drag = false;
    }
    // drawGrid(gridSize, adaptiveGridCb.checked);
    drawGrid(gridSize, false);
    // drawPoint(mouse.x, mouse.y);

    requestAnimationFrame(update);
}

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Get the current transformation matrix of the canvas
    const transform = ctx.getTransform();

    // Apply the transformation to the coordinates
    const absoluteX = (x - transform.e) / transform.a;
    const absoluteY = (y - transform.f) / transform.d;

    console.log(`Clicked at (${absoluteX}, ${absoluteY})`);
});

const flextree = d3.flextree;
const layout = flextree();
const tree = layout.hierarchy({
    size: [1, 1],
    children: [
        { size: [2, 4] },
        {
            size: [3, 1],
            children: [
                { size: [4, 1] },
            ],
        },
    ],
});

function drawTree(node) {
    console.log("Drawing node:", node)
    // x,y,width, height
    ctx.fillStyle = 'red'
    ctx.fillRect(node.x * 50, node.y * 50, node.data.size[0] * 50 - 10, node.data.size[1] * 50 - 10);
    if (node.children) {
        node.children.forEach(child => drawTree(child));
    }
}
// function drawTree(node) {

//     // Get the current transformation matrix
//     const transform = ctx.getTransform();

//     // Invert the transformation matrix
//     const inverseTransform = new DOMMatrix();
//     if (transform.isInvertible) {
//         inverseTransform = transform.inverse();
//     }

//     // Create a new path
//     ctx.beginPath();

//     // Apply the inverted transformation matrix to the coordinates
//     const x = node.x * 50;
//     const y = node.y * 50;
//     const width = node.data.size[0] * 50 - 10;
//     const height = node.data.size[1] * 50 - 10;

//     const staticX = x * inverseTransform.a + y * inverseTransform.c + inverseTransform.e;
//     const staticY = x * inverseTransform.b + y * inverseTransform.d + inverseTransform.f;
//     const staticWidth = width * inverseTransform.a + height * inverseTransform.c;
//     const staticHeight = width * inverseTransform.b + height * inverseTransform.d;

//     // Set the fill style
//     ctx.fillStyle = 'red';

//     // Draw the rectangle at its static position
//     ctx.fillRect(staticX, staticY, staticWidth, staticHeight);

//     // Close the path
//     ctx.closePath();

//     if (node.children) {
//         node.children.forEach(child => drawTree(child));
//     }
// }


layout(tree);
drawGrid(gridSize, false);
drawTree(tree);
// tree.each(node => console.log(`(${node.x}, ${node.y})`));
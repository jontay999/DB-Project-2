const margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120,
},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

let root = {
    children: [
        {
            children: [
                {
                    children: [
                        {
                            children: [
                                {
                                    children: [
                                        {
                                            children: [
                                                {
                                                    children: [
                                                        {
                                                            children: [],
                                                            cost: [0, 33907.5],
                                                            id: 7,
                                                            rows: 624938,
                                                            secondary_content: ["o_totalprice > '10'"],
                                                            table: "orders",
                                                            title: "Parallel Seq Scan",
                                                            width: 16,
                                                        },
                                                        {
                                                            children: [
                                                                {
                                                                    children: [],
                                                                    cost: [0, 4366.25],
                                                                    id: 9,
                                                                    rows: 12648,
                                                                    secondary_content: [
                                                                        "c_mktsegment = 'BUILDING'",
                                                                    ],
                                                                    table: "customer",
                                                                    title: "Parallel Seq Scan",
                                                                    width: 4,
                                                                },
                                                            ],
                                                            cost: [4366.25, 4366.25],
                                                            id: 8,
                                                            rows: 12648,
                                                            secondary_content: [],
                                                            table: null,
                                                            title: "Parallel Hash",
                                                            width: 4,
                                                        },
                                                    ],
                                                    cost: [4524.35, 40072.36],
                                                    id: 6,
                                                    rows: 126467,
                                                    secondary_content: [
                                                        "orders.o_custkey = customer.c_custkey",
                                                    ],
                                                    table: null,
                                                    title: "Parallel Hash Join",
                                                    width: 12,
                                                },
                                                {
                                                    children: [],
                                                    cost: [0.43, 1.11],
                                                    id: 10,
                                                    rows: 16,
                                                    secondary_content: [
                                                        "l_orderkey = orders.o_orderkey",
                                                        "l_extendedprice > '10'",
                                                    ],
                                                    table: "lineitem",
                                                    title: "Index Scan using lineitem_pkey",
                                                    width: 16,
                                                },
                                            ],
                                            cost: [4524.78, 201208.53],
                                            id: 5,
                                            rows: 505894,
                                            secondary_content: [],
                                            table: null,
                                            title: "Nested Loop",
                                            width: 24,
                                        },
                                    ],
                                    cost: [259515.64, 260780.37],
                                    id: 4,
                                    rows: 505894,
                                    secondary_content: [
                                        "lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority",
                                    ],
                                    table: null,
                                    title: "Sort",
                                    width: 24,
                                },
                            ],
                            cost: [259515.64, 274692.46],
                            id: 3,
                            rows: 505894,
                            secondary_content: [
                                "lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority",
                            ],
                            table: null,
                            title: "Partial GroupAggregate",
                            width: 44,
                        },
                    ],
                    cost: [260515.66, 392477.92],
                    id: 2,
                    rows: 1011788,
                    secondary_content: ["Workers Planned: 2"],
                    table: null,
                    title: "Gather Merge",
                    width: 44,
                },
            ],
            cost: [260515.66, 420302.08],
            id: 1,
            rows: 1214145,
            secondary_content: [
                "lineitem.l_orderkey, orders.o_orderdate, orders.o_shippriority",
            ],
            table: null,
            title: "Finalize GroupAggregate",
            width: 44,
        },
    ],
    cost: [617704.6, 620739.96],
    id: 0,
    rows: 1214145,
    secondary_content: [
        "(sum((lineitem.l_extendedprice * ('1' - lineitem.l_discount)))) DESC, orders.o_orderdate",
    ],
    table: null,
    title: "Sort",
    width: 44,
};

const duration = 750,
    rectW = 60 * 2 * 2,
    rectH = 30 * 2;

const tree = d3.layout.tree().nodeSize([70, 40]);
const diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.x + rectW / 2, d.y + rectH / 2];
});

const svg = d3
    .select("#canvas-div")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .call((zm = d3.behavior.zoom().scaleExtent([0.2, 3]).on("zoom", redraw)))
    .append("g")
    .attr("transform", "translate(" + 350 + "," + 20 + ")");

//necessary so that zoom knows where to zoom and unzoom from
zm.translate([350, 20]);



function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

root.children.forEach(collapse);
root.x0 = 0;
root.y0 = height / 2;
update(root);


function update_root(new_root) {
    root = new_root;
    root.children.forEach(collapse);
    root.x0 = 0;
    root.y0 = height / 2;
    update(root);
}


d3.select("#body").style("height", "800px");

function update(source) {
    // Compute the new tree layout.
    const nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = d.depth * 120;
        d.x = d.x * 8;
    });

    // Update the nodes…
    const node = svg.selectAll("g.node").data(nodes, function (d) {
        return d.id;
    });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + source.x0 + "," + source.y0 + ")";
        })
        .on("click", clickNode);

    nodeEnter
        .append("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    nodeEnter
        .append("text")
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.title;
        });

    // Transition nodes to their new position.
    const nodeUpdate = node
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    nodeUpdate
        .select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();

    nodeExit
        .select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        //.attr("width", bbox.getBBox().width)""
        //.attr("height", bbox.getBBox().height)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    nodeExit.select("text");

    // Update the links…
    const link = svg.selectAll("path.link").data(links, function (d) {
        return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr("d", function (d) {
            const o = {
                x: source.x0,
                y: source.y0,
            };
            return diagonal({
                source: o,
                target: o,
            });
        });

    // Transition links to their new position.
    link.transition().duration(duration).attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", function (d) {
            const o = {
                x: source.x,
                y: source.y,
            };
            return diagonal({
                source: o,
                target: o,
            });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function clickNode(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

//Redraw for zoom
function redraw() {
    svg.attr(
        "transform",
        "translate(" +
        d3.event.translate +
        ")" +
        " scale(" +
        d3.event.scale +
        ")"
    );
}
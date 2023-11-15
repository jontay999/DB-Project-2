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

root = {}

let clickedNodeData = null;

const duration = 750,
  rectW = 60 * 2 * 2 + 40,
  rectH = 30 * 3 + 5;

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

// add button in html to zoom in
d3.select("#zoom_in").on("click", function () {
  zm.scale(zm.scale() * 1.2);
  zm.event(svg);
});

// add button in html to zoom out
d3.select("#zoom_out").on("click", function () {
  zm.scale(zm.scale() * 0.8);
  zm.event(svg);
});

function update_root(new_root) {
  root = new_root;
  root.x0 = 0;
  root.y0 = height / 2;
  update(root);
}

d3.select("#body").style("height", "800px");

function getBufferString(buffer_dict) {
  arr = [];
  for (let [key, value] of Object.entries(buffer_dict)) {
    arr.push(`${key}: ${value}`);
  }
  return arr.join(", ");
}

function update(source) {
  // remove all previous nodes
  for (let old_node of document.querySelectorAll("g.node")) {
    old_node.remove();
  }
  for (let old_link of document.querySelectorAll("path.link")) {
    old_link.remove();
  }

  // Compute the new tree layout.
  const nodes = tree.nodes(source).reverse();
  const links = tree.links(nodes);

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

  // draw the rectangle
  nodeEnter
    .append("rect")
    .attr("width", rectW)
    .attr("height", rectH)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.2)
    .attr("rx", 4)
    .attr("ry", 4)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  nodeEnter
    .append("foreignObject")
    .attr("width", rectW)
    .attr("height", rectH)
    .append("xhtml:div")
    .style("height", "100%")
    .html(function (d) {
      // Create a custom HTML structure for each node
      return `
            <div style='height:100%;width:100%;margin:auto;padding: 10px 15px;'>
              <div style='display:flex;justify-content:space-between;'>    
                <span><b>${d.title}</b></span>
                <span style='color:#afafaf'>#${parseInt(d.id) + 1}</span>
              </div>
              ${d.buffer ?
          `<div style='font-size:13px;color:grey'>
                <span><b>Buffers: </b> ${getBufferString(d.buffer)}</span>
              </div>` : ""
        }
            </div>
        `;
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
  updateNodeInfo(d);
  clickedNodeData = d;
  return;
}

//Redraw for zoom
function redraw() {
  svg.attr(
    "transform",
    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"
  );
}

// update_root(root);

// Get blocks and tuples accessed when user clicks on the button
document
  .getElementById("blocksAccessedButton")
  .addEventListener("click", async () => {
    try {
      // Open the blocks accessed div when button is clicked and show loading
      const blocksAccessedInfo = document.getElementById("blocksAccessedInfo");
      const blocksAccessedButton = document.getElementById(
        "blocksAccessedButton"
      );
      const blocksAccessedDiv = document.getElementById("blocksAccessedDiv");
      const blocksAccessedContent = document.getElementById(
        "blocksAccessed-content"
      );
      blocksAccessedInfo.style.display = "none";
      blocksAccessedButton.style.display = "none";
      blocksAccessedDiv.style.display = "block";
      blocksAccessedContent.textContent = "Loading...";
      // Check if there is a selected node
      if (clickedNodeData != null) {
        // Concatenate table with secondary table if there is one to form FROM condition in query
        let table = clickedNodeData.table;
        if (clickedNodeData.secondary_table) {
          table += "," + clickedNodeData.secondary_table;
        }
        // Fetch blocks accessed and number of tuples accessed within the block
        const response = await fetch("/query2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table: clickedNodeData.table,
            where_condition: clickedNodeData.secondary_content[0]
              ? clickedNodeData.secondary_content[0]
              : "",
            from_tables: table,
          }),
        });

        // Display in a table, the blocks accessed and number of tuples accessed within the block
        if (response.ok) {
          let data = await response.json();
          if (data.error) {
            openModal("Error", JSON.stringify(data, undefined, 2));
          }
          // Displays in a row of a table, block number followed by number of tuples accessed, with an option to view details with onclick function
          let tablerowscontent = data["blocks"].map((block) => {
            let tuples_count = data["blocks_and_tuples_count"][block];
            let tuples = data["blocks_and_tuples_dict"][block];
            return `<tr><td>${block}</td><td><span>${tuples_count}</span><span onclick="fetchTuples('${block}', '${tuples}', '${clickedNodeData.table}')" style="color: blue; text-decoration: underline; cursor: pointer; font-size: 0.8em; margin-left: 4px;">(View details)</span></td></tr>`;
          });
          // Display the table
          blocksAccessedContent.innerHTML =
            "<table class='table'><thead><tr><th scope='col'>Block #</th><th scope='col'>Number of Tuples Accessed</th></tr></thead><tbody>" +
            tablerowscontent.join("") +
            "</tbody></table>";
        } else {
          alert("sql query failed!");
          openModal("Error", "Something went wrong! Please try again.");
        }
      }
    } catch (error) {
      console.error("err:", error);
    }
  });

// Fetch tuples accessed within the block
async function fetchTuples(block, tuples, table) {
  const response = await fetch("/query3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      table: table,
      block_id: block,
      tuples_id: tuples,
    }),
  });
  if (response.ok) {
    let data = await response.json();
    if (data.error) {
      openModal("Error", JSON.stringify(data, undefined, 2));
    }
    let tuplesCount = data["tuples"].length;
    // Save the header to show indexes of tuples accessed in a variable
    let tuplesAccessed = `<div style="margin-bottom:30px" ><h5> ${tuplesCount > 1 ? "Indexes of Tuples Accessed" : "Index of Tuple Accessed"
      }</h5><div>${tuples}</div></div>`;
    // Save the content of each tuple in a table row for (up to) top 5 tuples in block in a variable
    let tableRows = data["tuples"]
      .map((tuple) => {
        let cells = tuple.map((item) => `<td>${item}</td>`).join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");
    // Save the headers of the table in a variable
    let tableHeaders = data["headers"]
      .map((header) => `<th scope="col">${header}</th>`)
      .join("");
    // Display the table using the variables defined above
    let topTuplesData = `<div class="flex flex-col"><h5>${tuplesCount > 1 ? `First ${tuplesCount} Tuples` : "Tuple"
      } Accessed</h5><table class="table"><thead><tr>${tableHeaders}</tr></thead><tbody>${tableRows}<tbody></table><div>`;
    openModal(
      `Information on Tuples Accessed in Block ${block}`,
      tuplesAccessed + topTuplesData
    );
  } else {
    alert("sql query failed!");
    openModal("Error", "Something went wrong! Please try again.");
  }
}

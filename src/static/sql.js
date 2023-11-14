const sqlForm = document.getElementById("sqlForm");
sqlForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputValue = document.getElementById("sql_query").value;
  if (inputValue.includes("EXPLAIN")) {
    alert("Do not include explain in the query");
    return;
  }
  const jsonData = { sql_query: inputValue };
  try {
    const response = await fetch("/query", {
      method: "POST",
      body: JSON.stringify(jsonData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      let data = await response.json();
      if (data.error) {
        openModal("Error", JSON.stringify(data, undefined, 2));
      }

      console.log("got data:", data);

      // for debugging
      // document.getElementById("queryOutput").textContent = JSON.stringify(data, undefined, 2);

      update_root(data["result"]);

      // update summary box
      document.getElementById("summary-content").textContent = data["summary"]
        .split("\n")
        .join("\n");

      const timingList = data["timing"];
      const overviewContent = document.getElementById("overview_content");
      overviewContent.textContent = timingList.join("\n");

      // update node info box
      const nodeInfoDiv = document.getElementById("nodeInfo");
      const nodeInfoPlaceholder = document.getElementById(
        "nodeInfo_placeholder"
      );
      nodeInfoDiv.style.display = "none";
      nodeInfoPlaceholder.style.display = "block";

      // update blocks accessed block
      const blocksAccessedDiv = document.getElementById("blocksAccessedDiv");
      blocksAccessedDiv.style.display = "none";
    } else {
      alert("sql query failed!");
      openModal("Error", "Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error("err:", error);
  }
});

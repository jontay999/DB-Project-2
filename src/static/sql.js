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
    } else {
      alert("sql query failed!");
      // dhruval put your modal here
      openModal("Error", "Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error("err:", error);
  }
});

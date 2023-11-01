const sqlForm = document.getElementById("sqlForm");
sqlForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("I am here;")
    const jsonData = { sql_query: document.getElementById("sql_query").value };
    try {

        const response = await fetch("/query", {
            method: "POST",
            body: JSON.stringify(jsonData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();

            console.log("got data:", data)
            document.getElementById("queryOutput").textContent = JSON.stringify(data, undefined, 2);
        } else {
            alert("sql query failed!")
            // dhruval put your modal here
        }
    } catch (error) {
        console.error('err:', error)
    }
})
document.addEventListener("DOMContentLoaded", () => {
  const noteList = document.getElementById("notes");
  const addNote = document.getElementById("add-button");
  const noteInput = document.getElementById("note-input");

  
  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      noteList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.text; // item.id + ": " + JSON.stringify(item);
        noteList.appendChild(li);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete";
        // need a way to identify which element was clicked
        deleteButton.className = "deleteButton";
        // item does not exist outside this loop so need to assign id to each button so that I can recall the IDs later for the routes
        // dataset.id is the way to do this. Cannot use id because update and delete buttons will have the same id and therefore not unique.
        deleteButton.dataset.id = item.id;
        li.appendChild(deleteButton);

        const updateButton = document.createElement("button");
        updateButton.textContent = "update";
        updateButton.className = "updateButton";
        updateButton.dataset.id = item.id;
        li.appendChild(updateButton);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ADD
  addNote.addEventListener("click", async (event) => {
    event.preventDefault();
    const newData = { text: noteInput.value };

    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        noteInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

    /*  cannot add event listener to the delete and update buttons because these buttons and the list items do not yet exist.
        Instead add event listener to the unordered list as this exists from the start. Then check when an event happens and if that 
        event is a button click. Then perform one of the functions below depending on which button was clicked. */
    
    noteList.addEventListener("click", async (event) => {
    event.preventDefault();

    // DELETE
    if (event.target.className === "deleteButton") {
    const itemId = event.target.dataset.id;
    try {
      const response = await fetch(`/data/${itemId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
    }
    
    // UPDATE
     if (event.target.className === "updateButton") {
        const itemId = event.target.dataset.id;
        // need a pop up to get the new input
        // default to exist text so that it's easier to edit
        const newData = prompt("Enter new text:", "");
        if (!newData) return;
        try {
            const response = await fetch(`/data/${itemId}`,{
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newData }),
            });
            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error adding data:", error);
        }
  }
});

  fetchData();
});

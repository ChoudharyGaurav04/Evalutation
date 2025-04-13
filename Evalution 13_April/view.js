const notesGrid = document.getElementById("notesGrid");
const searchBar = document.getElementById("searchBar");
const priorityFilter = document.getElementById("priorityFilter");
const sortOptions = document.getElementById("sortOptions");

const db = firebase.firestore();

let allNotes = [];

async function fetchNotes() {
  try {
    const snapshot = await db.collection("notes").get();
    allNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayNotes(allNotes);
  } catch {
    // Fallback to localStorage
    allNotes = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)));
    displayNotes(allNotes);
  }
}

function displayNotes(notes) {
  notesGrid.innerHTML = "";
  notes.forEach(note => {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.innerHTML = `
      <h3>${note.title}</h3>
      <div class="note-body">${note.description}</div>
      <p><strong>Priority:</strong> ${note.priority}</p>
      <p><strong>Tags:</strong> ${note.tags.join(", ")}</p>
      ${note.imageURL ? `<img src="${note.imageURL}" alt="Note Image" />` : ""}
      <p><small>${new Date(note.timestamp).toLocaleString()}</small></p>
      <button onclick="deleteNote('${note.id}')">Delete</button>
    `;
    notesGrid.appendChild(noteCard);
  });
}

function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  db.collection("notes").doc(id).delete().then(() => fetchNotes());
  localStorage.removeItem(id);
}

function applyFilters() {
  const search = searchBar.value.toLowerCase();
  const priority = priorityFilter.value;
  let filtered = allNotes.filter(note =>
    note.title.toLowerCase().includes(search) &&
    (priority ? note.priority === priority : true)
  );

  if (sortOptions.value === "dateAsc") {
    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } else if (sortOptions.value === "dateDesc") {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortOptions.value === "priority") {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  displayNotes(filtered);
}

searchBar.addEventListener("input", applyFilters);
priorityFilter.addEventListener("change", applyFilters);
sortOptions.addEventListener("change", applyFilters);

fetchNotes();

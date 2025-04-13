// Firebase config - replace with your credentials
const firebaseConfig = {
  apiKey: "AIzaSyCBZ8wGvQ10jrLpWuzmuEM2j9XdNyqkJr8",
  authDomain: "evaluationsixapr.firebaseapp.com",
  projectId: "evaluationsixapr",
  storageBucket: "evaluationsixapr.firebasestorage.app",
  messagingSenderId: "53464797491",
  appId: "53464797491"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById("noteForm");
const statusMsg = document.getElementById("statusMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("richTextEditor").innerHTML.trim();
  const tags = Array.from(document.getElementById("tags").selectedOptions).map(opt => opt.value);
  const priority = document.getElementById("priority").value;
  const imageInput = document.getElementById("imageUpload");

  if (!title || !description) {
    statusMsg.textContent = "Please fill in all required fields.";
    return;
  }

  let imageURL = "";
  if (imageInput.files[0]) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      imageURL = reader.result;
      await saveNote(title, description, tags, priority, imageURL);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    await saveNote(title, description, tags, priority, imageURL);
  }
});

async function saveNote(title, description, tags, priority, imageURL) {
  const timestamp = new Date().toISOString();
  const note = { title, description, tags, priority, imageURL, timestamp };

  try {
    const docRef = await db.collection("notes").add(note);
    localStorage.setItem(docRef.id, JSON.stringify(note));
    form.reset();
    document.getElementById("richTextEditor").innerHTML = "";
    statusMsg.textContent = "Your note has been successfully saved!";
  } catch (error) {
    statusMsg.textContent = "Error saving note.";
    console.error(error);
  }
}

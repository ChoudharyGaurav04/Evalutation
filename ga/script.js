// Firebase ref
const db = firebase.database();

// Elements
const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");
const darkToggle = document.getElementById("darkModeToggle");
const loadDataBtn = document.getElementById("loadDataBtn");
const sortBtn = document.getElementById("sortBtn");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");

// Dark Mode
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Hamburger nav toggle
document.getElementById("hamburger").addEventListener("click", () => {
  document.querySelector("nav").classList.toggle("active");
});

// Form Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value;
  const gender = form.gender.value;
  const skills = Array.from(form.querySelectorAll("input[name='skills']:checked")).map(i => i.value);
  const fileInput = document.getElementById("profileImage");

  const student = {
    name,
    age,
    email,
    course,
    gender,
    skills,
    image: ""
  };

  // Handle image upload as Base64
  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      student.image = reader.result;
      saveStudent(student);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveStudent(student);
  }

  form.reset();
});

// Save student (to localStorage and Firebase)
function saveStudent(student) {
  // LocalStorage
  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));

  // Firebase
  const newRef = db.ref("students").push();
  newRef.set(student);

  addStudentToTable(student);
}

// Load from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach(addStudentToTable);
});

// Add student row to table
function addStudentToTable(student) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.age}</td>
    <td>${student.email}</td>
    <td>${student.course}</td>
    <td>${student.gender}</td>
    <td>${student.skills.join(", ")}</td>
    <td>${student.image ? `<img src="${student.image}" alt="Profile Image" />` : "N/A"}</td>
  `;

  tableBody.appendChild(row);
}

// Load data from Firebase
loadDataBtn.addEventListener("click", () => {
  db.ref("students").once("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const students = Object.values(data);
      localStorage.setItem("students", JSON.stringify(students));
      tableBody.innerHTML = "";
      students.forEach(addStudentToTable);
    }
  });
});

// Search filter
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const name = row.children[0].textContent.toLowerCase();
    row.style.display = name.includes(keyword) ? "" : "none";
  });
});

// Sort A-Z by name
sortBtn.addEventListener("click", () => {
  const rows = Array.from(tableBody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const nameA = a.children[0].textContent.toLowerCase();
    const nameB = b.children[0].textContent.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  tableBody.innerHTML = "";
  rows.forEach((row) => tableBody.appendChild(row));
});

// Clear All
clearAllBtn.addEventListener("click", () => {
  if (confirm("Clear all student data?")) {
    localStorage.removeItem("students");
    tableBody.innerHTML = "";
    db.ref("students").remove();
  }
});

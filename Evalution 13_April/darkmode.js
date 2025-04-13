const toggle = document.getElementById("darkModeToggle");
const body = document.body;

// Load mode from LocalStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggle.textContent = isDark ? "☀️" : "🌙";
});

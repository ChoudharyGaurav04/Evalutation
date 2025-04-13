document.getElementById("clearLocalStorage").addEventListener("click", () => {
    if (confirm("Clear all locally saved notes?")) {
      localStorage.clear();
      alert("All local notes cleared!");
    }
  });
  
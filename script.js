document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });
  
  document.getElementById('signUp').addEventListener('click', function() {
    alert('Redirecting to Sign Up page...');
  });
  
  document.getElementById('logIn').addEventListener('click', function() {
    alert('Redirecting to Log In page...');
  });
  
  // Dark mode styles
  const style = document.createElement('style');
  style.textContent = `
    .dark-mode {
      background-color: #1e1e2f;
      color: #ffffff;
    }
  
    header, footer {
      background-color: #3730a3;
    }
  
    .nav-buttons button {
      background-color: #5b21b6;
    }
  `;
  document.head.appendChild(style);
  
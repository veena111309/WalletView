// =====================
//  auth.js — Wallet View
// =====================

// ── SIGNUP ──────────────────────────────────────────────
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    // Check if user already exists
    const existing = JSON.parse(localStorage.getItem('wv_users') || '[]');
    const alreadyExists = existing.find(u => u.username === username);
    if (alreadyExists) {
      alert('Username already taken. Please choose another.');
      return;
    }

    // Save new user
    existing.push({ username, password });
    localStorage.setItem('wv_users', JSON.stringify(existing));

    alert('Account created! Please log in.');
    window.location.href = 'login.html';
  });
}

// ── LOGIN ────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = JSON.parse(localStorage.getItem('wv_users') || '[]');
    const match = users.find(u => u.username === username && u.password === password);

    if (match) {
      localStorage.setItem('wv_loggedIn', username);
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid username or password.');
    }
  });
}

// ── GUARD: Redirect to login if not logged in ────────────
function requireLogin() {
  if (!localStorage.getItem('wv_loggedIn')) {
    window.location.href = 'login.html';
  }
}
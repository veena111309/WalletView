// ===========================
//  settings.js — Wallet View
// ===========================

requireLogin();

const user         = localStorage.getItem('wv_loggedIn');
const currentMonth = new Date().toLocaleString('default', { month: 'long' });

// Show username
document.getElementById('usernameDisplay').textContent = user;
document.getElementById('userInitial').textContent     = user.charAt(0).toUpperCase();

// ── CHANGE PASSWORD ───────────────────────────────────────
function changePassword() {
  const oldPass  = document.getElementById('oldPass').value;
  const newPass  = document.getElementById('newPass').value;
  const confPass = document.getElementById('confPass').value;

  const users = JSON.parse(localStorage.getItem('wv_users') || '[]');
  const idx   = users.findIndex(u => u.username === user);

  if (idx === -1)                    { alert('User not found.');                  return; }
  if (users[idx].password !== oldPass){ alert('Current password is incorrect.');  return; }
  if (newPass.length < 6)            { alert('New password must be 6+ chars.');   return; }
  if (newPass !== confPass)          { alert('Passwords do not match.');           return; }

  users[idx].password = newPass;
  localStorage.setItem('wv_users', JSON.stringify(users));
  alert('Password updated successfully!');

  document.getElementById('oldPass').value  = '';
  document.getElementById('newPass').value  = '';
  document.getElementById('confPass').value = '';
}

// ── CLEAR THIS MONTH ─────────────────────────────────────
function clearMonthData() {
  if (!confirm(`Clear all data for ${currentMonth}?`)) return;

  // Expenses
  const expenses = JSON.parse(localStorage.getItem(`wv_expenses_${user}`) || '[]');
  localStorage.setItem(`wv_expenses_${user}`,
    JSON.stringify(expenses.filter(e => e.month !== currentMonth)));

  // Investments
  const investments = JSON.parse(localStorage.getItem(`wv_investments_${user}`) || '[]');
  localStorage.setItem(`wv_investments_${user}`,
    JSON.stringify(investments.filter(i => i.month !== currentMonth)));

  alert(`${currentMonth} data cleared.`);
}

// ── CLEAR ALL DATA ────────────────────────────────────────
function clearAllData() {
  if (!confirm('This will delete ALL your expenses, investments and cards. Are you sure?')) return;
  localStorage.removeItem(`wv_expenses_${user}`);
  localStorage.removeItem(`wv_investments_${user}`);
  localStorage.removeItem(`wv_cards_${user}`);
  localStorage.removeItem(`wv_income_${user}`);
  alert('All data cleared.');
}

// ── LOGOUT ────────────────────────────────────────────────
function logout() {
  localStorage.removeItem('wv_loggedIn');
  window.location.href = 'login.html';
}
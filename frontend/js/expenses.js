// ==========================
//  expenses.js — Wallet View
// ==========================

requireLogin();

const user = localStorage.getItem('wv_loggedIn');
const STORAGE_KEY = `wv_expenses_${user}`;
const currentMonth = new Date().toLocaleString('default', { month: 'long' });

// ── LOAD ─────────────────────────────────────────────────
function loadExpenses() {
  const expenses = getExpenses();
  const list = document.getElementById('expenseList');
  list.innerHTML = '';

  let total = 0;

  expenses.forEach((exp, index) => {
    total += exp.amount;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${exp.name} <small style="color:#aaa">(${exp.month})</small></span>
      <span>
        ₹${exp.amount.toLocaleString('en-IN')}
        <button onclick="deleteExpense(${index})">✕</button>
      </span>
    `;
    list.appendChild(li);
  });

  document.getElementById('totalExpenses').textContent = total.toLocaleString('en-IN');
}

// ── GET ───────────────────────────────────────────────────
function getExpenses() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// ── ADD ───────────────────────────────────────────────────
function addExpense() {
  const name   = document.getElementById('expName').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value);

  if (!name || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  const expenses = getExpenses();
  expenses.push({ name, amount, month: currentMonth });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

  document.getElementById('expName').value   = '';
  document.getElementById('expAmount').value = '';

  loadExpenses();
}

// ── DELETE ────────────────────────────────────────────────
function deleteExpense(index) {
  const expenses = getExpenses();
  expenses.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  loadExpenses();
}

// ── INIT ──────────────────────────────────────────────────
loadExpenses();
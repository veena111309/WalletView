// ============================
//  investments.js — Wallet View
// ============================

requireLogin();

const user = localStorage.getItem('wv_loggedIn');
const STORAGE_KEY = `wv_investments_${user}`;
const currentMonth = new Date().toLocaleString('default', { month: 'long' });

// ── LOAD ──────────────────────────────────────────────────
function loadInvestments() {
  const investments = getInvestments();
  const list = document.getElementById('investmentList');
  list.innerHTML = '';

  let total = 0;

  investments.forEach((inv, index) => {
    total += inv.amount;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${inv.name} <small style="color:#aaa">(${inv.month})</small></span>
      <span>
        ₹${inv.amount.toLocaleString('en-IN')}
        <button onclick="deleteInvestment(${index})">✕</button>
      </span>
    `;
    list.appendChild(li);
  });

  document.getElementById('totalInvested').textContent = total.toLocaleString('en-IN');
}

// ── GET ───────────────────────────────────────────────────
function getInvestments() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// ── ADD ───────────────────────────────────────────────────
function addInvestment() {
  const name   = document.getElementById('invName').value.trim();
  const amount = parseFloat(document.getElementById('invAmount').value);

  if (!name || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid investment name and amount.');
    return;
  }

  const investments = getInvestments();
  investments.push({ name, amount, month: currentMonth });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));

  document.getElementById('invName').value   = '';
  document.getElementById('invAmount').value = '';

  loadInvestments();
}

// ── DELETE ────────────────────────────────────────────────
function deleteInvestment(index) {
  const investments = getInvestments();
  investments.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
  loadInvestments();
}

// ── INIT ──────────────────────────────────────────────────
loadInvestments();
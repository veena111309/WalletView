// =========================
//  budget.js — Wallet View
// =========================

requireLogin();

const user         = localStorage.getItem('wv_loggedIn');
const currentMonth = new Date().toLocaleString('default', { month: 'long' });

function saveIncome() {
  const val = parseFloat(document.getElementById('incomeInput').value);
  if (isNaN(val) || val <= 0) { alert('Enter a valid income amount.'); return; }
  localStorage.setItem(`wv_income_${user}`, val);
  document.getElementById('incomeInput').value = '';
  loadBudget();
}

function loadBudget() {
  const income      = parseFloat(localStorage.getItem(`wv_income_${user}`) || 0);
  const expenses    = JSON.parse(localStorage.getItem(`wv_expenses_${user}`)    || '[]');
  const investments = JSON.parse(localStorage.getItem(`wv_investments_${user}`) || '[]');

  const totalExp = expenses
    .filter(e => e.month === currentMonth)
    .reduce((s, e) => s + e.amount, 0);

  const totalInv = investments
    .filter(i => i.month === currentMonth)
    .reduce((s, i) => s + i.amount, 0);

  const savings = Math.max(0, income - totalExp - totalInv);

  document.getElementById('currentIncome').textContent = income.toLocaleString('en-IN');

  // Expense bar
  const expPct = income > 0 ? Math.min((totalExp / income) * 100, 100) : 0;
  document.getElementById('expLabel').textContent = `₹${totalExp.toLocaleString('en-IN')} / ₹${income.toLocaleString('en-IN')}`;
  const expBar = document.getElementById('expBar');
  expBar.style.width = expPct + '%';
  expBar.className = 'progress-bar' + (expPct >= 90 ? ' over' : '');

  // Investment bar
  const invPct = income > 0 ? Math.min((totalInv / income) * 100, 100) : 0;
  document.getElementById('invLabel').textContent = `₹${totalInv.toLocaleString('en-IN')} / ₹${income.toLocaleString('en-IN')}`;
  document.getElementById('invBar').style.width = invPct + '%';

  // Savings bar
  const savPct = income > 0 ? Math.min((savings / income) * 100, 100) : 0;
  document.getElementById('savLabel').textContent = `₹${savings.toLocaleString('en-IN')}`;
  document.getElementById('savBar').style.width = savPct + '%';
}

loadBudget();
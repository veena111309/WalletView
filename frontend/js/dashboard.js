// ==========================
//  dashboard.js — Wallet View
// ==========================

requireLogin();

let currentMonth = new Date().toLocaleString('default', { month: 'long' });

// ── HIGHLIGHT active month button ────────────────────────
function highlightMonth(month) {
  document.querySelectorAll('.month-bar button').forEach(btn => {
    btn.style.background = btn.textContent.trim() === month.slice(0, 3) ? '#E83E8C' : '#22265a';
  });
}

// ── CHANGE MONTH ─────────────────────────────────────────
function changeMonth(month) {
  currentMonth = month;
  highlightMonth(month);
  loadDashboard();
}

// ── TOGGLE SIDEBAR ───────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

// ── LOAD DATA ────────────────────────────────────────────
function loadDashboard() {
  const user     = localStorage.getItem('wv_loggedIn');
  const expenses = JSON.parse(localStorage.getItem(`wv_expenses_${user}`) || '[]');
  const investments = JSON.parse(localStorage.getItem(`wv_investments_${user}`) || '[]');
  const income   = parseFloat(localStorage.getItem(`wv_income_${user}`) || 0);

  // Filter by month
  const monthExpenses    = expenses.filter(e => e.month === currentMonth);
  const monthInvestments = investments.filter(i => i.month === currentMonth);

  const totalExp = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalInv = monthInvestments.reduce((s, i) => s + i.amount, 0);
  const savings  = income - totalExp - totalInv;

  document.getElementById('income').textContent     = '₹' + income.toLocaleString('en-IN');
  document.getElementById('expenses').textContent   = '₹' + totalExp.toLocaleString('en-IN');
  document.getElementById('investment').textContent = '₹' + totalInv.toLocaleString('en-IN');
  document.getElementById('savings').textContent    = '₹' + (savings > 0 ? savings : 0).toLocaleString('en-IN');

  renderCharts(totalExp, totalInv, income, savings);
}

// ── CHARTS ───────────────────────────────────────────────
let barChartInstance = null;
let pieChartInstance = null;

function renderCharts(expenses, investments, income, savings) {
  const barCtx = document.getElementById('barChart').getContext('2d');
  const pieCtx = document.getElementById('pieChart').getContext('2d');

  if (barChartInstance) barChartInstance.destroy();
  if (pieChartInstance) pieChartInstance.destroy();

  barChartInstance = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses', 'Investments', 'Savings'],
      datasets: [{
        label: currentMonth,
        data: [income, expenses, investments, savings > 0 ? savings : 0],
        backgroundColor: ['#4CAF50', '#E83E8C', '#9C27B0', '#2196F3'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#fff' } } },
      scales: {
        x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
        y: { ticks: { color: '#ccc' }, grid: { color: '#333' } }
      }
    }
  });

  pieChartInstance = new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Expenses', 'Investments', 'Savings'],
      datasets: [{
        data: [expenses, investments, savings > 0 ? savings : 0],
        backgroundColor: ['#E83E8C', '#9C27B0', '#2196F3'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#fff' } } }
    }
  });
}

// ── INIT ─────────────────────────────────────────────────
highlightMonth(currentMonth);
loadDashboard();
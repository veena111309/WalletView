// ===========================
//  accounts.js — Wallet View
// ===========================

requireLogin();

const user = localStorage.getItem('wv_loggedIn');
const STORAGE_KEY = `wv_cards_${user}`;

function getCards() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function deleteCard(index) {
  if (!confirm('Remove this card?')) return;
  const cards = getCards();
  cards.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  loadAccounts();
}

function loadAccounts() {
  const cards   = getCards();
  const list    = document.getElementById('cardList');
  list.innerHTML = '';

  let totalBalance = 0;
  let totalCash    = 0;

  if (cards.length === 0) {
    list.innerHTML = '<p style="color:#aaa">No cards added yet.</p>';
  }

  cards.forEach((card, index) => {
    totalBalance += card.balance;
    totalCash    += card.handCash;

    const div = document.createElement('div');
    div.className = 'card-tile';
    div.innerHTML = `
      <div>
        <div class="bank-name">${card.bank}</div>
        <div class="card-no">•••• •••• •••• ${card.last4} &nbsp;|&nbsp; Exp: ${card.expiry}</div>
      </div>
      <div class="balance">
        <span>₹${card.balance.toLocaleString('en-IN')}</span>
        <small>Hand Cash: ₹${card.handCash.toLocaleString('en-IN')}</small>
      </div>
      <button onclick="deleteCard(${index})">Remove</button>
    `;
    list.appendChild(div);
  });

  document.getElementById('totalBalance').textContent = totalBalance.toLocaleString('en-IN');
  document.getElementById('totalCash').textContent    = totalCash.toLocaleString('en-IN');
  document.getElementById('netWorth').textContent     = (totalBalance + totalCash).toLocaleString('en-IN');
}

loadAccounts();
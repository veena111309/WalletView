// ========================
//  card.js — Wallet View
// ========================

requireLogin();

const user = localStorage.getItem('wv_loggedIn');
const STORAGE_KEY = `wv_cards_${user}`;

// ── SHOW/HIDE custom bank input ───────────────────────────
const bankSelect  = document.getElementById('bankSelect');
const customBank  = document.getElementById('customBank');

if (bankSelect) {
  bankSelect.addEventListener('change', function () {
    customBank.style.display = this.value === 'Other' ? 'block' : 'none';
  });
}

// ── ADD CARD ─────────────────────────────────────────────
const cardForm = document.getElementById('cardForm');
if (cardForm) {
  cardForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const bank       = bankSelect.value === 'Other'
                         ? customBank.value.trim()
                         : bankSelect.value;
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cvv        = document.getElementById('cvv').value.trim();
    const expiry     = document.getElementById('expiry').value.trim();
    const balance    = parseFloat(document.getElementById('balance').value);
    const handCash   = parseFloat(document.getElementById('handCash').value);

    // Validations
    if (!bank)                          { alert('Please select a bank.');               return; }
    if (!/^\d{16}$/.test(cardNumber))   { alert('Card number must be 16 digits.');      return; }
    if (!/^\d{3}$/.test(cvv))           { alert('CVV must be 3 digits.');               return; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { alert('Expiry format must be MM/YY.');        return; }
    if (isNaN(balance) || balance < 0)  { alert('Enter a valid balance.');              return; }
    if (isNaN(handCash) || handCash < 0){ alert('Enter a valid hand cash amount.');     return; }

    const cards = getCards();

    // Mask card number — store last 4 only
    cards.push({
      bank,
      last4:    cardNumber.slice(-4),
      expiry,
      balance,
      handCash
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    alert(`Card ending in ${cardNumber.slice(-4)} added successfully!`);
    window.location.href = 'accounts.html';
  });
}

// ── GET ───────────────────────────────────────────────────
function getCards() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
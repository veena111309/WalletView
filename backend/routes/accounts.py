"""
routes/accounts.py — Wallet View
Endpoints: /api/accounts/        GET, POST
           /api/accounts/<id>    DELETE
"""

from flask import Blueprint, request, jsonify
from db import get_db

accounts_bp = Blueprint('accounts', __name__)


@accounts_bp.route('/', methods=['GET'])
def get_accounts():
    user_id = request.args.get('user_id', type=int)
    db   = get_db()
    rows = db.execute(
        'SELECT * FROM accounts WHERE user_id = ? ORDER BY id DESC', (user_id,)
    ).fetchall()
    return jsonify([dict(r) for r in rows]), 200


@accounts_bp.route('/', methods=['POST'])
def add_account():
    data     = request.get_json()
    user_id  = data.get('user_id')
    bank     = data.get('bank', '').strip()
    last4    = data.get('last4', '').strip()
    expiry   = data.get('expiry', '').strip()
    balance  = data.get('balance', 0)
    hand_cash= data.get('hand_cash', 0)

    if not user_id or not bank or not last4:
        return jsonify({'error': 'user_id, bank and last4 are required.'}), 400

    db = get_db()
    db.execute(
        'INSERT INTO accounts (user_id, bank, last4, expiry, balance, hand_cash) VALUES (?,?,?,?,?,?)',
        (user_id, bank, last4, expiry, balance, hand_cash)
    )
    db.commit()
    return jsonify({'message': 'Card added.'}), 201


@accounts_bp.route('/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    db = get_db()
    db.execute('DELETE FROM accounts WHERE id = ?', (account_id,))
    db.commit()
    return jsonify({'message': 'Card removed.'}), 200
"""
routes/expenses.py — Wallet View
Endpoints: /api/expenses/        GET, POST
           /api/expenses/<id>    DELETE
"""

from flask import Blueprint, request, jsonify
from db import get_db

expenses_bp = Blueprint('expenses', __name__)


@expenses_bp.route('/', methods=['GET'])
def get_expenses():
    user_id = request.args.get('user_id', type=int)
    month   = request.args.get('month')

    db    = get_db()
    query = 'SELECT * FROM expenses WHERE user_id = ?'
    args  = [user_id]

    if month:
        query += ' AND month = ?'
        args.append(month)

    rows = db.execute(query + ' ORDER BY id DESC', args).fetchall()
    return jsonify([dict(r) for r in rows]), 200


@expenses_bp.route('/', methods=['POST'])
def add_expense():
    data    = request.get_json()
    user_id = data.get('user_id')
    name    = data.get('name', '').strip()
    amount  = data.get('amount')
    month   = data.get('month', '')

    if not user_id or not name or not amount:
        return jsonify({'error': 'user_id, name and amount are required.'}), 400

    db = get_db()
    db.execute(
        'INSERT INTO expenses (user_id, name, amount, month) VALUES (?, ?, ?, ?)',
        (user_id, name, amount, month)
    )
    db.commit()
    return jsonify({'message': 'Expense added.'}), 201


@expenses_bp.route('/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    db = get_db()
    db.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
    db.commit()
    return jsonify({'message': 'Expense deleted.'}), 200
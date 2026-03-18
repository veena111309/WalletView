"""
routes/investments.py — Wallet View
Endpoints: /api/investments/        GET, POST
           /api/investments/<id>    DELETE
"""

from flask import Blueprint, request, jsonify
from db import get_db

investments_bp = Blueprint('investments', __name__)


@investments_bp.route('/', methods=['GET'])
def get_investments():
    user_id = request.args.get('user_id', type=int)
    month   = request.args.get('month')

    db    = get_db()
    query = 'SELECT * FROM investments WHERE user_id = ?'
    args  = [user_id]

    if month:
        query += ' AND month = ?'
        args.append(month)

    rows = db.execute(query + ' ORDER BY id DESC', args).fetchall()
    return jsonify([dict(r) for r in rows]), 200


@investments_bp.route('/', methods=['POST'])
def add_investment():
    data    = request.get_json()
    user_id = data.get('user_id')
    name    = data.get('name', '').strip()
    amount  = data.get('amount')
    month   = data.get('month', '')

    if not user_id or not name or not amount:
        return jsonify({'error': 'user_id, name and amount are required.'}), 400

    db = get_db()
    db.execute(
        'INSERT INTO investments (user_id, name, amount, month) VALUES (?, ?, ?, ?)',
        (user_id, name, amount, month)
    )
    db.commit()
    return jsonify({'message': 'Investment added.'}), 201


@investments_bp.route('/<int:inv_id>', methods=['DELETE'])
def delete_investment(inv_id):
    db = get_db()
    db.execute('DELETE FROM investments WHERE id = ?', (inv_id,))
    db.commit()
    return jsonify({'message': 'Investment deleted.'}), 200

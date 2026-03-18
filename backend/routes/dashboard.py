"""
routes/dashboard.py — Wallet View
Endpoint: /api/dashboard/summary  GET
"""

from flask import Blueprint, request, jsonify
from db import get_db

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/summary', methods=['GET'])
def summary():
    user_id = request.args.get('user_id', type=int)
    month   = request.args.get('month', '')

    if not user_id:
        return jsonify({'error': 'user_id is required.'}), 400

    db = get_db()

    income_row = db.execute(
        'SELECT income FROM users WHERE id = ?', (user_id,)
    ).fetchone()
    income = income_row['income'] if income_row and income_row['income'] else 0

    exp_row = db.execute(
        'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ? AND month = ?',
        (user_id, month)
    ).fetchone()

    inv_row = db.execute(
        'SELECT COALESCE(SUM(amount), 0) AS total FROM investments WHERE user_id = ? AND month = ?',
        (user_id, month)
    ).fetchone()

    savings = max(0, income - exp_row['total'] - inv_row['total'])

    return jsonify({
        'month':       month,
        'income':      income,
        'expenses':    exp_row['total'],
        'investments': inv_row['total'],
        'savings':     savings
    }), 200


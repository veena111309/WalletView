"""
routes/auth.py — Wallet View
Endpoints: /api/auth/register  POST
           /api/auth/login     POST
"""

from flask import Blueprint, request, jsonify, current_app
from db import get_db
import hashlib, hmac, time, json, base64

auth_bp = Blueprint('auth', __name__)


def _hash_password(password: str) -> str:
    """Simple SHA-256 hash. Use bcrypt in production."""
    return hashlib.sha256(password.encode()).hexdigest()


def _make_token(user_id: int, username: str) -> str:
    """Create a simple base64 token. Replace with JWT in production."""
    payload = json.dumps({
        'user_id':  user_id,
        'username': username,
        'exp':      time.time() + current_app.config['JWT_EXPIRY_HOURS'] * 3600
    })
    return base64.b64encode(payload.encode()).decode()


# ── REGISTER ──────────────────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    data     = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'error': 'Username and password are required.'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters.'}), 400

    db = get_db()
    existing = db.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
    if existing:
        return jsonify({'error': 'Username already taken.'}), 409

    db.execute(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        (username, _hash_password(password))
    )
    db.commit()

    return jsonify({'message': 'Account created successfully!'}), 201


# ── LOGIN ─────────────────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    db   = get_db()
    user = db.execute(
        'SELECT id, username, password_hash FROM users WHERE username = ?',
        (username,)
    ).fetchone()

    if not user or user['password_hash'] != _hash_password(password):
        return jsonify({'error': 'Invalid username or password.'}), 401

    token = _make_token(user['id'], user['username'])
    return jsonify({'token': token, 'username': user['username']}), 200
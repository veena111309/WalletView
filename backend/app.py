"""
app.py — Wallet View Backend
Flask entry point
"""

from flask import Flask
from flask_cors import CORS
from config import Config
from db import init_db

from routes.auth        import auth_bp
from routes.accounts    import accounts_bp
from routes.expenses    import expenses_bp
from routes.investments import investments_bp
from routes.dashboard   import dashboard_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp,        url_prefix='/api/auth')
app.register_blueprint(accounts_bp,    url_prefix='/api/accounts')
app.register_blueprint(expenses_bp,    url_prefix='/api/expenses')
app.register_blueprint(investments_bp, url_prefix='/api/investments')
app.register_blueprint(dashboard_bp,   url_prefix='/api/dashboard')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
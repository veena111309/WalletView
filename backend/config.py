"""
config.py — Wallet View Backend
App configuration settings
"""

import os

class Config:
    SECRET_KEY         = os.environ.get('SECRET_KEY', 'walletview_secret_2024')
    DATABASE           = os.path.join(os.path.dirname(__file__), '..', 'database', 'walletview.db')
    JWT_EXPIRY_HOURS   = 24
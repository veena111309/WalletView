-- sample_data.sql — Wallet View test data
-- password for testuser = "123456"  (SHA-256 hash)

INSERT INTO users (username, password_hash, income) VALUES
('testuser', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 50000);

INSERT INTO expenses (user_id, name, amount, month) VALUES
(1, 'Groceries',   3500,  'March'),
(1, 'Electricity', 1200,  'March'),
(1, 'Internet',     700,  'March'),
(1, 'Groceries',   3200,  'February'),
(1, 'Transport',    800,  'February');

INSERT INTO investments (user_id, name, amount, month) VALUES
(1, 'Mutual Fund', 10000, 'March'),
(1, 'SIP',          5000, 'March'),
(1, 'Mutual Fund',  8000, 'February');

INSERT INTO accounts (user_id, bank, last4, expiry, balance, hand_cash) VALUES
(1, 'SBI',  '4321', '12/26', 45000, 3000),
(1, 'HDFC', '8765', '08/25', 28000, 0);
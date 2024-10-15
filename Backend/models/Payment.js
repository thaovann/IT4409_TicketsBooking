const db = require('../config/db');

// Tạo bảng nếu chưa tồn tại
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        event_id INT,
        amount DECIMAL(10, 2),
        status VARCHAR(255) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
    )
`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating payments table:', err);
    } else {
        console.log('Payments table created or already exists');
    }
});

const Payment = {
    create: (paymentData, callback) => {
        const query = 'INSERT INTO payments (user_id, event_id, amount, status) VALUES (?, ?, ?, ?)';
        db.query(query, [paymentData.user_id, paymentData.event_id, paymentData.amount, paymentData.status], callback);
    },
    findById: (paymentId, callback) => {
        const query = 'SELECT * FROM payments WHERE id = ?';
        db.query(query, [paymentId], callback);
    },
    updateStatus: (paymentId, status, callback) => {
        const query = 'UPDATE payments SET status = ? WHERE id = ?';
        db.query(query, [status, paymentId], callback);
    }
};

module.exports = Payment;
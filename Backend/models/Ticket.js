const db = require('../config/db');

// Tạo bảng nếu chưa tồn tại
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        event_id INT,
        status VARCHAR(255) DEFAULT 'booked',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
    )
`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating tickets table:', err);
    } else {
        console.log('Tickets table created or already exists');
    }
});

const Ticket = {
    create: (ticketData, callback) => {
        const query = 'INSERT INTO tickets (user_id, event_id, status) VALUES (?, ?, ?)';
        db.query(query, [ticketData.user_id, ticketData.event_id, ticketData.status], callback);
    },
    findByUserId: (userId, callback) => {
        const query = 'SELECT * FROM tickets WHERE user_id = ?';
        db.query(query, [userId], callback);
    }
};

module.exports = Ticket;
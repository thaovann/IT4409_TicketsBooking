const db = require('../config/db');

// Tạo bảng nếu chưa tồn tại
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating events table:', err);
    } else {
        console.log('Events table created or already exists');
    }
});

const Event = {
    create: (eventData, callback) => {
        const query = 'INSERT INTO events (name, description, location, date) VALUES (?, ?, ?, ?)';
        db.query(query, [eventData.name, eventData.description, eventData.location, eventData.date], callback);
    },
    findById: (eventId, callback) => {
        const query = 'SELECT * FROM events WHERE id = ?';
        db.query(query, [eventId], callback);
    }
};

module.exports = Event;
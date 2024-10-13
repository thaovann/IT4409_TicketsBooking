const db = require('../config/db');

// Tạo bảng nếu chưa tồn tại
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating users table:', err);
    } else {
        console.log('Users table created or already exists');
    }
});

const User = {
    create: (userData, callback) => {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [userData.name, userData.email, userData.password], callback);
    },
    findById: (userId, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [userId], callback);
    }
};

module.exports = User;
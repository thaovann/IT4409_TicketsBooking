const User = require('../models/User');

exports.register = (req, res) => {
    const { name, email, password } = req.body;
    User.create({ name, email, password }, (err, result) => {
        if (err) return res.status(500).send('Error creating user');
        res.status(201).send('User created successfully');
    });
};

exports.getUser = (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send('Error fetching user');
        res.json(user);
    });
};
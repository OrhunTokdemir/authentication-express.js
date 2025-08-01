const express = require('express');
const router = express.Router();
const { checkForLogin } = require('../dbMethods');
const { generateToken } = require('../authUtils');
const { comparePassword } = require('../authUtils');
const { pool } = require('../db');

router.post('/', async (req, res) => {
    const {username, password} = req.body;
    if (username==null || password==null) {
        return res.status(400).send('Username and password are required!');
    }
    try {
        const user = await checkForLogin(pool, username, password, comparePassword);
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        // Generate JWT token
        const payload = { 
            id: user.id,
            username: user.username,
            role: user.role
        };
        const token = await generateToken(payload);
        res.status(200).json({
            message: `Login successful. Welcome ${user.username}!`,
            token: token
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { checkUsernameAndEmail, insertUserToDb } = require('../dbMethods');
const { hashPassword } = require('../authUtils');
const { pool } = require('../db');

router.post('/', async (req, res) => {
    const {username, email, password}=req.body;
    if (username==null || email==null || password==null) {
        return res.status(400).send('Username, email and password are required!');
    }
    try {
        const result = await checkUsernameAndEmail(pool, username, email);
        if (result.username && result.email) {
            return res.status(409).send('Username and email already exist');
        } else if (result.username) {
            return res.status(409).send('Username already exists');
        } else if (result.email) {
            return res.status(409).send('Email already exists');
        }
        const newUser = await insertUserToDb(pool, username, email, password, 'user', hashPassword);
        console.log('New user registered:', newUser.username);
        return res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

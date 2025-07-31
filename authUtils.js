const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function generateToken(payload, duration = '1h') {

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: duration });
    return token;
}

async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded;
    } catch (err) {
        console.error('Error verifying JWT:', err);
        return null;
    }    
}


async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}


module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword
};
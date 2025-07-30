const jwt = require('jsonwebtoken');
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

module.exports = {
    generateToken,
    verifyToken
}; 
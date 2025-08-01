const express = require('express');
const router = express.Router();
const { verifyToken } = require('../authUtils');

router.post('/', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    const decoded = await verifyToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
        return res.status(403).send('Forbidden');
    }
    res.send('This is a secret route');
});

module.exports = router;

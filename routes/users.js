const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
    const users = await db.query('SELECT * FROM users');
    res.send(users);
});
module.exports = router;
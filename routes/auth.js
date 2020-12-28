const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');
require('dotenv').config();

router.post('/register', async (req, res) => {
    const {
        first_name,
        last_name,
        email,
    } = req.body;
    const emailExist = await db.query(`SELECT email FROM users WHERE email = '${email}'`)
    if (emailExist[0]) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = { first_name, last_name, email, password };

    try {
        await db.query('INSERT INTO users set ?', user);
        console.log('user saved');
        res.send(user);
    } catch (err) {
        console.log(err);
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.query(`SELECT id, first_name, last_name, email, password FROM users WHERE email = '${email}'`);
    if(!user[0]) return res.status(400).send('Password or email is incorrect');
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) return res.status(400).send('Password or email is incorrect');

    jwt.sign({ user: user[0]}, process.env.JWT_KEY, (err, token) => {
        console.log(err);
        if (err) throw (err);
        res.json({
            userId: user[0].id,
            token: token
        })
    })
})
router.get('/verify', verifyToken, async (req, res) => {
    console.log(req.user);
    console.log('you have permisions');
});

module.exports = router;
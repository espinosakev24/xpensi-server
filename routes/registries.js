const express = require('express');
const router = express.Router();
const db = require('../db/db');
const verifyToken = require('./verifyToken');
const { canDoPutRequest } = require('./../operations/routeOperations');

router.get('/all', async (req, res) => {
    const registries = await db.query(`SELECT * FROM registries`);
    res.send(registries);
});

router.get('/', verifyToken, async (req, res) => {
    const userId = req.decoded.user.id;

    const registries = await db.query(`SELECT * FROM registries where user_id = '${userId}'`);
    res.send(registries);
});
router.post('/', verifyToken, async (req, res) => {
    const userId = req.decoded.user.id;
    const registry = {
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        user_id: userId
    }
    try {
        await db.query('INSERT INTO registries set ?', registry);
        res.send(registry);
    } catch (err) {
        console.log(err)
    }
});
router.put('/registry/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, amount, reg_date } = req.body;
    const userId = req.decoded.user.id;

    // if (!canDoPutRequest(id, userId)) return res.status(400).send('You can not perform this operation');
    try {
        const updated = await db.query(
            `UPDATE registries SET title = ?, description = ?, amount = ?, reg_date = ? WHERE id = ?`,
            [title, description, amount, reg_date, id]
        );
        res.send(updated);
    } catch (err) {
        console.log(err);
    }
});
router.delete('/registry/:id', verifyToken, async (req, res) => {
    const userId = req.decoded.user.id;
    const { id } = req.params;
    const deleted = await db.query(`DELETE FROM registries WHERE id = ${id} AND user_id = '${userId}'`);
    res.send(deleted);
});
module.exports = router;
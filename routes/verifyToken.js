const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
        if (err) return res.status(400).send('Invalid Token');
        req.decoded = decoded;
        next();
    })
}
module.exports = verifyToken;
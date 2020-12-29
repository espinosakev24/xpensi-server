require('custom-env').env(process.env.NODE_ENV);
const express = require('express');
const app = express();
const registriesRoutes = require('./routes/registries');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser')
const cors = require('cors');

console.log(process.env);
app.use(cors());
app.use(bodyParser.json());


app.use('/registries', registriesRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);


app.listen(process.env.PORT || '4000', () => {
    console.log('app listening in port', process.env.PORT);
});
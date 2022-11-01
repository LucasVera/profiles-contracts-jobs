const express = require('express');
const bodyParser = require('body-parser');

const errorHandler = require('./middleware/errorHandler');

const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { setApiRoutes } = require('./routes');


const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

setApiRoutes(app);

// Catch-all
app.use(errorHandler);

module.exports = app;

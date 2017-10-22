var config = require('./config');

// This trivial export makes it so we can use a happy path with sequelize cli
module.exports = config.dbConnection;
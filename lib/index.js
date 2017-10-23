'use strict';

const Hapi = require('hapi');
const epimetheus = require('epimetheus');
const container = require('./services/ioc/container');

// Create server
const server = new Hapi.Server();
server.connection(container.get('HapiConfig'));

// Register health metrics
epimetheus.instrument(server);

// Register inversify plugin, which will register all Controller routes from container
server.register(
    {
        register: require('./plugins/inversifyPlugin'), 
        options: { container: container }
    },
    err => { if (err) throw err; }
);

// Test DB Connection at spin up
var sequelize = container.get('Sequelize');
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

'use strict';

const Hapi = require('hapi');
const epimetheus = require('epimetheus');
const JWT = require('jsonwebtoken'); 

// Dependency wireup and IoC service
const container = require('./services/ioc/container');
var config = container.get('Config');

// Create server with injected 
const server = new Hapi.Server();
server.connection(container.get('HapiConfig'));

// Register health metrics
epimetheus.instrument(server);

// Register JWT auth
server.register(
    {
        register: require('hapi-auth-jwt2')
    },
    err => { if (err) throw err; }
);
server.auth.strategy('jwt', 'jwt', {
    key: config.jwtSecret,
    validateFunc: function (decoded, request, callback) {
        // sample non-production validation: just validate if a proper id number has been passed
        // Here is where we would inject actual authentication (identity from our own identity provider or a third party i.e. Google)
        if (typeof decoded.id === "number")
            return callback(null, true);
        return callback(null, false);
    },
    verifyOptions: { ignoreExpiration: true }
});

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

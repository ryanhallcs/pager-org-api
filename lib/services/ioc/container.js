var inversify = require("inversify");
require('reflect-metadata');

// Helper function for js IoC support
var decorateAndInject = function(container, type, name, injectionArr, singleton = false) {
    inversify.decorate(inversify.injectable(), type);
    for (var i = 0; i < injectionArr.length; i++) {
        var injection = injectionArr[i];
        inversify.decorate(inversify.inject(injection), type, i);
    }
    if (singleton) {
        container.bind(name).to(type).inSingletonScope();
    }
    else {
        container.bind(name).to(type);
    }
}

// Dependencies to register
var config = require('../../config');
var JWT = require('jsonwebtoken'); 
var Sequelize = require('sequelize');
var OrganizationModel = require('../../models/organization').Organization;
var OrganizationService = require('../organizationService').OrganizationService;
var OrganizationController = require('../../controllers/organizationController').OrganizationController;
var LoginController = require('../../controllers/loginController').LoginController;

// Bind required dependencies in specified scopes
var container = new inversify.Container();
container.bind('Config').toConstantValue(config);
container.bind('DbConfig').toConstantValue(config.dbConnection);
container.bind('HapiConfig').toConstantValue(config.hapi);
container.bind('Sequelize').toDynamicValue(context => new Sequelize(context.container.get('DbConfig'))).inSingletonScope();
container.bind('OrganizationDb').toDynamicValue(context => {
    return context.container.get('Sequelize').define('Organizations', OrganizationModel.dbSchema, { timestamps: false });
}).inSingletonScope();
container.bind('JWT').toConstantValue(JWT);
container.bind('JWTSecret').toConstantValue(config.jwtSecret);
decorateAndInject(container, OrganizationService, 'OrganizationService', ['OrganizationDb']);
decorateAndInject(container, OrganizationController, 'Controller', ['OrganizationService']);
decorateAndInject(container, LoginController, 'Controller', ['JWT', 'JWTSecret']);

module.exports = container;
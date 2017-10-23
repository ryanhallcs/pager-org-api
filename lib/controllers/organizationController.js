const Joi = require('joi');
const OrganizationModel = require('../models/organization').Organization;
const OrganizationService = require('../services/organizationService').OrganizationService;

export class OrganizationController {
    constructor(orgService) {
        this.orgService = orgService;
    }

    get idRoute() {
        return {
            method: 'GET',
            path: '/api/v1/organization/{id}',
            config: {
                auth: 'jwt',
                validate: {
                    params: {
                        id: Joi.number().required()
                    }
                },
                handler: (request, reply) => {
                    var id = request.params.id;
    
                    this.orgService.getOrganizationById(id, !!request.query.code).then(org => {
                        if (!org) {
                            reply('No org with id ' + id + ' was found').code(404);
                        }
                        else {
                            reply(org);
                        }
                    }, err => {
                        reply('Resource id error').code(500);
                    });
                }
            }
        };
    }

    get searchRoute() {
        return {
            method: 'GET',
            path: '/api/v1/organization',
            config: {
                auth: 'jwt',
                validate: {
                    query: Joi.object().keys({
                        code: Joi.string(),
                        name: Joi.string()
                    }).xor('code', 'name')
                },
                handler: (request, reply) => {
                    var searchTerm = request.query.name || request.query.code;
                    var includeExtraAttributes = !!request.query.code;
                    var searchType = !!request.query.name ? OrganizationService.SEARCH_NAME : OrganizationService.SEARCH_CODE;
    
                    this.orgService.searchOrganization(searchTerm, searchType, includeExtraAttributes)
                        .then(org => {
                            if (!org) {
                                reply('No org found for ' + searchType + ' ' + searchTerm).code(404);
                            }
                            else {
                                reply(org);
                            }
                        }, err => {
                            reply('Search error').code(500);
                        });
                }
            }
        };
    }

    get createRoute() {
        return {
            method: ['POST'],
            path: '/api/v1/organization',
            config: {
                auth: 'jwt',
                validate: {
                    payload: OrganizationModel.schema
                },
                handler: (request, reply) => {
                    this.orgService.createOrganization(request.payload)
                        .then(result => reply(result),
                                err => { 
                                    reply('Create error').code(500);
                                });
                }
            }
        };
    }

    get updateRoute() {
        return {
            method: ['PUT'],
            path: '/api/v1/organization',
            config: {
                auth: 'jwt',
                validate: {
                    payload: Joi.object().keys({
                        id: Joi.number().required(),
                        code: Joi.string(),
                        name: Joi.string(),
                        description: Joi.string(),
                        url: Joi.string().uri(),
                        type: Joi.string().valid(OrganizationModel.ALL_TYPES)
                    })
                },
                handler: (request, reply) => {
                    this.orgService.updateOrganization(request.payload).then(result => {
                        if (result) {
                            reply(result);
                        }
                        else {
                            reply(null).code(404);
                        }
                    }, err => {
                        reply('Update error').code(500);
                    });
                }
            }
        };
    }

    getAllRoutes() {
        return [this.createRoute, this.searchRoute, this.idRoute, this.updateRoute];
    }
}

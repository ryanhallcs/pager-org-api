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
                handler: (request, reply) => {
                    var id = request.params.id;
    
                    var org = this.orgService.getOrganizationById(id);
                    if (!org) {
                        reply('No org with id ' + id + ' was found').code(404);
                    }
                    else {
                        reply(org);
                    }
                }
            }
        };
    }

    get searchRoute() {
        return {
            method: 'GET',
            path: '/api/v1/organization',
            config: {
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
    
                    var org = this.orgService.searchOrganization(searchTerm, searchType, includeExtraAttributes);
                    if (!org) {
                        reply('No org found for ' + searchType + ' ' + searchTerm).code(404);
                    }
                    else {
                        reply(org);
                    }
                }
            }
        };
    }

    get createRoute() {
        return {
            method: ['POST'],
            path: '/api/v1/organization',
            config: {
                validate: {
                    payload: OrganizationModel.schema
                },
                handler: (request, reply) => {
                    reply(this.orgService.createOrganization(request.payload));
                }
            }
        };
    }

    get updateRoute() {
        return {
            method: ['PUT'],
            path: '/api/v1/organization',
            config: {
                validate: {
                    payload: Joi.object().keys({
                        id: Joi.number(),
                        code: Joi.string(),
                        name: Joi.string(),
                        description: Joi.string(),
                        url: Joi.string().uri(),
                        type: Joi.string().valid(OrganizationModel.ALL_TYPES)
                    }).or('id', 'code', 'name')
                },
                handler: (request, reply) => {
                    reply(this.orgService.updateOrganization(request.payload));
                }
            }
        };
    }

    getAllRoutes() {
        return [this.createRoute, this.searchRoute, this.idRoute, this.updateRoute];
    }
}

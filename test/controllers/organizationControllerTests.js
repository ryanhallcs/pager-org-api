var expect = require('chai').expect;

var Organization = require('../../lib/models/organization').Organization;
var OrganizationController = require('../../lib/controllers/organizationController').OrganizationController;
const Hapi = require('hapi');

describe('idRoute', () => {
    const org1 = {
        id: 1,
        name: 'org',
        description: 'an org',
        url: 'http://org.com',
        code: 'ORG1',
        type: Organization.EMPLOYER_TYPE
    };
    var server = null;

    beforeEach(() => {
        server = new Hapi.Server();
        server.connection({ port: 8001 });
    });
    
    it('should return 404 when not found', (done) => {
        var options = {
            method: 'GET',
            url: '/api/v1/organization/1'
        };

        var service = {
            getOrganizationById: function(id, includeExtraAttributes = false) {
                return Promise.resolve(null);
            }
        };
        
        var sut = new OrganizationController(service);
        server.route(sut.idRoute);
        server.inject(options, result => {
            expect(result.statusCode).to.equal(404);
            done();
        });
    });
    
    it('should return org when found', (done) => {
        var options = {
            method: 'GET',
            url: '/api/v1/organization/1'
        };

        var service = {
            getOrganizationById: function(id, includeExtraAttributes = false) {
                return Promise.resolve(org1);
            }
        };

        var sut = new OrganizationController(service);
        server.route(sut.idRoute);
        server.inject(options, result => {
            expect(result.result).to.equal(org1);
            expect(result.statusCode).to.equal(200);
            done();
        });
    });
});

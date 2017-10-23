var expect = require('chai').expect;

var Organization = require('../../lib/models/organization').Organization;
var OrganizationService = require('../../lib/services/organizationService').OrganizationService;

describe('OrganizationService', () => {
    const org1 = {
        id: 1,
        name: 'org',
        description: 'an org',
        url: 'http://org.com',
        code: 'ORG1',
        type: Organization.EMPLOYER_TYPE
    };
    
    // Happy path base case, ensure straightforward query result are returned
    it('should search org by code', () => {
        var orgDb = {
            findOne: function(search) {
                return Promise.resolve(org1);
            }
        };
        
        var sut = new OrganizationService(orgDb);

        sut.searchOrganization('ORG1', OrganizationService.SEARCH_CODE).then(org => {
            expect(org).to.equal(org1);
        });
    });
})
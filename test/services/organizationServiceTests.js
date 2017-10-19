var expect = require('chai').expect;

var Organization = require('../../models/organization');
var OrganizationService = require('../../lib/services/organizationService');

define('OrganizationService', () => {
    const org1 = {
        id: 1,
        name: 'org',
        description: 'an org',
        url: 'http://org.com',
        code: 'ORG1',
        type: Organization.EMPLOYER_TYPE
    };
    
    // Happy path base case, ensure straightforward query result are returned
    it('should find org by code', () => {
        var orgDb = {
            findAll: function(search) {
                return new Promise((resolve, reject) => resolve([org]));
            }
        };
        
        var sut = new OrganizationService(orgDb);

        var result = sut.findOrg('ORG1', OrganizationService.SEARCH_CODE);
        expect(result).to.equal(org);
    });
})
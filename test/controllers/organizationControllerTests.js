var expect = require('chai').expect;

var organizationController = require('../../lib/controllers/organizationController');

describe('idRoute', () => {
    it('should return id passed in', () => {
        var request = {
            params: {
                id: 'test'
            }
        };
    
        var result = null;
        organizationController.idRoute.handler(request, s => result = s);
        expect(result).to.not.be.null;
    });
});

const OrganizationModel = require('../models/organization').Organization;

export class OrganizationService {
    static get SEARCH_CODE() { return 'code'; }
    static get SEARCH_NAME() { return 'name'; }

    constructor(organizationDb) {
        this.organizationDb = organizationDb;
        this.allAttributes = Object.keys(OrganizationModel.dbSchema);
        this.defaultAttributes = this.allAttributes.filter(attr => attr != 'code' && attr != 'url');
    }

    getOrganizationById(id, includeExtraAttributes = false) {
        console.log("Searching for org by id %s", id);
        var attributes = includeExtraAttributes ? this.allAttributes : this.defaultAttributes;
        return this.organizationDb.findById(id, { attributes: attributes });
    }

    searchOrganization(searchTerm, searchType) {
        console.log("Searching for %s %s and %s including extra attrs", searchType, searchTerm, searchType == OrganizationService.SEARCH_CODE ? 'is' : 'is not');
        var where = {};
        where[searchType] = searchTerm;
        var attributes = searchType == OrganizationService.SEARCH_CODE ? this.allAttributes : this.defaultAttributes;
        return this.organizationDb.findOne({ where: where, attributes: attributes });
    }

    createOrganization(org) {
        console.log("Creating %s", JSON.stringify(org));
        return this.organizationDb.create(org);
    }

    updateOrganization(org) {
        console.log("Updating %s", JSON.stringify(org));
        return this.organizationDb.update(org, { 
            where: { id: org.id },
            returning: true 
        }).then(result => {
                var affectedRows = result[0];
                if (affectedRows == 0) {
                    return Promise.resolve(null);
                }
                return Promise.resolve(result[1][0]);
            });
    }
}

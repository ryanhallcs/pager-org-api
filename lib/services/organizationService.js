export class OrganizationService {
    static get SEARCH_CODE() { return 'code'; }
    static get SEARCH_NAME() { return 'name'; }

    constructor(organizationDb) {
        this.organizationDb = organizationDb;
    }

    getOrganizationById(id) {
        console.log("Searching for org by id %s", id);
        return null; //{ id: id, name: 'test' };
    }

    searchOrganization(searchTerm, searchType, includeExtraAttributes) {
        console.log("Searching for %s %s and %s including extra attrs", searchType, searchTerm, includeExtraAttributes ? 'is' : 'is not');
        return null; //{ id: 1, code: searchTerm, name: 'test' };
    }

    createOrganization(org) {
        console.log("Creating %s", JSON.stringify(org));
        return org;
    }

    updateOrganization(org) {
        console.log("Updating %s", JSON.stringify(org));
        return org;
    }
}

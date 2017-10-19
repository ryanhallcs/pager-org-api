var OrganizationModel = require('../models/organization').Organization;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Organizations', OrganizationModel.dbSchema)
            .then(() => {
                queryInterface.addIndex('Organizations', ['name'], {
                    unique: true
                })
            }).then(() => {
                queryInterface.addIndex('Organizations', ['code'], {
                    unique: true
                })
            });


    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Organizations');
    }
}

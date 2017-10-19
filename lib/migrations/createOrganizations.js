module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Organizations', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            url: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.STRING
            }
        });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Organizations');
    }
  }
  
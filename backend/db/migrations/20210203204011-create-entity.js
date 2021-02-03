'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Entities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255)
      },
      description: {
        type: Sequelize.STRING(1000)
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }
      },
      pseudonymId: {
        type: Sequelize.INTEGER,
        references: { model: 'Pseudonyms' }
      },
      typeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'EntityTypes' }
      },
      parentId: {
        type: Sequelize.INTEGER,
        references:{ model: 'Entities' }
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Entities');
  }
};

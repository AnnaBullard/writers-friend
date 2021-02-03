'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('EntityTypes', [
      {type:"chapter/story"},
      {type:"book"},
      {type:"book series"},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('EntityTypes', null, {});
  }
};

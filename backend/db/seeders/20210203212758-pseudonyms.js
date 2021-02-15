'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pseudonyms', [
      {firstName:"John", middleName: "Ronald Ruel",lastName:"Tolkien",userId: 1, isActive: false},
      {firstName:"Jane", lastName:"Austen",userId: 1, isActive: false},
      {firstName:"Anna", lastName:"Bullard",userId: 1, isActive: true}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pseudonyms', null, {});
  }
};

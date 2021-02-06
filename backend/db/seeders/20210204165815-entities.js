'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Entities', [
      {title:"Middle-earth",                      userId: 1, pseudonymId: 1, typeId: 4, parentId: null, order: 0, isPublished: true},
      {title:"Lord of the Rings",                 userId: 1, pseudonymId: 1, typeId: 3, parentId: 1, order: 1, isPublished: true},
      {title:"The Fellowship of the Ring",        userId: 1, pseudonymId: 1, typeId: 2, parentId: 2, order: 0, isPublished: true},
      {title:"The Two Towers",                    userId: 1, pseudonymId: 1, typeId: 2, parentId: 2, order: 1, isPublished: true},
      {title:"The Return of the King",            userId: 1, pseudonymId: 1, typeId: 2, parentId: 2, order: 2, isPublished: true},
      {title:"A Long-expected Party",             userId: 1, pseudonymId: 1, typeId: 1, parentId: 3, order: 0, isPublished: true},
      {title:"The Shadow of the Past",            userId: 1, pseudonymId: 1, typeId: 1, parentId: 3, order: 1, isPublished: true},
      {title:"Three is Company",                  userId: 1, pseudonymId: 1, typeId: 1, parentId: 3, order: 2, isPublished: true},
      {title:"The Departure of Boromir",          userId: 1, pseudonymId: 1, typeId: 1, parentId: 4, order: 0, isPublished: true},
      {title:"The Riders of Rohan",               userId: 1, pseudonymId: 1, typeId: 1, parentId: 4, order: 1, isPublished: true},
      {title:"The Uruk-hai",                      userId: 1, pseudonymId: 1, typeId: 1, parentId: 4, order: 2, isPublished: true},
      {title:"Minas Tirith",                      userId: 1, pseudonymId: 1, typeId: 1, parentId: 5, order: 0, isPublished: false},
      {title:"The Passing of the Grey Company",   userId: 1, pseudonymId: 1, typeId: 1, parentId: 5, order: 1, isPublished: false},
      {title:"The Muster of Rohan",               userId: 1, pseudonymId: 1, typeId: 1, parentId: 5, order: 2, isPublished: false},
      {title:"Hobbits",                           userId: 1, pseudonymId: 1, typeId: 2, parentId: 1, order: 0, isPublished: true},
      {title:"An Unexpected Party",               userId: 1, pseudonymId: 1, typeId: 1, parentId: 15, order: 0, isPublished: true},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Entities', null, {});
  }
};

'use strict';
const {
  Op
} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cities', [
      {
        name: 'delhi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'jaipur',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'mumbai',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'chennai',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Cities',
      [{
        name: {
          [Op.or]: ['delhi', 'jaipur', 'mumbai', 'chennai']
        }
      }], {});
  }
};

'use strict';
const {
  Op
} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */


    await queryInterface.bulkInsert('Airplanes', [
      {
      modelNumber: 'Boeing 737',
      capacity: 180,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      modelNumber: 'Airbus A320',
      capacity: 180,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      modelNumber: 'Airbus A400',
      capacity: 240,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      modelNumber: 'Airbus A200',
      capacity: 400,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ])

  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Airplanes',
      [{
        modelNumber: {
          [Op.or]: ['Boeing 737', 'Airbus A320', 'Airbus A400', 'Airbus A200']
        }
      }], {});
  }
};

'use strict';
const {
  Op
} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Airports', [
     {
        name: "Indira Gandhi International Airport",
        code: "DEL",
        address: "New Delhi, Delhi",
        cityId: 1, // Delhi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jaipur International Airport",
        code: "JAI",
        address: "Jaipur, Rajasthan",
        cityId: 2, // Jaipur
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Chhatrapati Shivaji Maharaj International Airport",
        code: "BOM",
        address: "Mumbai, Maharashtra",
        cityId: 3, // Mumbai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Chennai International Airport",
        code: "MAA",
        address: "Chennai, Tamil Nadu",
        cityId: 4, // Chennai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airports',
      [{
        code: {
          [Op.or]: ['DEL', 'JAI', 'BOM', 'MAA']
        }
      }], {});
  }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SeatBookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
          allowNull: false,
      },
      flightId: {
        type: Sequelize.INTEGER,
          allowNull: false,
      },
      seatId: {
        type: Sequelize.INTEGER,
          allowNull: false,
      },
      bookingId: {
        type: Sequelize.INTEGER,
          allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
  {
    uniqueKeys: [
      {
        unique: true,
        fields: ["flightId", "seatId"], // no duplicate seat booking per flight
      },
    ],
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SeatBookings');
  }
};
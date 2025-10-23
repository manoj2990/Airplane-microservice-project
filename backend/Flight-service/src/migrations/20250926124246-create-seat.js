'use strict';
/** @type {import('sequelize-cli').Migration} */

const {Enums} = require("../utils/common");
const {BUSINESS,ECONOMY,PREMIUM_ECONOMY, FIRST_CLASS} = Enums.SeatType;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airplaneId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: 'airplanes',
          key: 'id',
        },
        // onDelete: 'CASCADE' means:
        // 1. When a row in the parent table (airplanes) is deleted,
        // 2. All rows in this child table (seats) that reference that airplaneId
        // 3. Will automatically be deleted as well.
        // This keeps referential integrity without manual cleanup.
        onDelete: 'CASCADE', 
      },
      row: {
        type: Sequelize.INTEGER,
         allowNull: false,
      },
      column: {
        type: Sequelize.STRING,
         allowNull: false,
      },
      type: {
        type: Sequelize.ENUM,
        values: [BUSINESS,ECONOMY,PREMIUM_ECONOMY, FIRST_CLASS],
        defaultValue: ECONOMY, 
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seats');
  }
};
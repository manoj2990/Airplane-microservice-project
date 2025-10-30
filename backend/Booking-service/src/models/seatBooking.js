'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeatBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each seat booking belongs to a booking
  SeatBooking.belongsTo(models.Booking, {
    foreignKey: 'bookingId',
    as: 'booking'
  });
      
    }
  }
  SeatBooking.init({
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flightId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  }, {
    indexes:[
      {
        unique: true,
        fields: ["flightId", "seatId"], // no duplicate seat booking per flight
      },
    ],
    sequelize,
    modelName: 'SeatBooking',
  });
  return SeatBooking;
};
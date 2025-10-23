'use strict';
const {
  Model
} = require('sequelize');
const {Enums} = require('../utils/common')
const {TICKET_STATUS} = Enums
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ticket.init({
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recepientEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values:[TICKET_STATUS.PENDING, TICKET_STATUS.SUCCESS, TICKET_STATUS.FAILED],
      defaultValue: TICKET_STATUS.PENDING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};
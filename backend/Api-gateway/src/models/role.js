'use strict';
const {
  Model
} = require('sequelize');
const { Enums } = require('../utils/common');
const { CUSTOMER, ADMIN, FLIGHT_COMPANY } = Enums.USER_ROLE;

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsToMany(models.User, 
        { 
          through:'User_Roles',
          as:'user',
          // foreignKey: 'roleId',
          // otherKey: 'userId'
        })
    }
  }
  Role.init({
     name: {
      type: DataTypes.ENUM({
        values: [ADMIN, CUSTOMER, FLIGHT_COMPANY]
      }),
      allowNull: false,
      defaultValue: CUSTOMER
    }}, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};
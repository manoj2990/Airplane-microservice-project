'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airplane.hasMany(models.Flight,{
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE',
      })
      // When an Airplane is deleted, all its related Seat records
      // are automatically deleted because of onDelete: 'CASCADE'
      Airplane.hasMany(models.Seat,{
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE',
        
      })
    }
  }

  Airplane.init({
    modelNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isAlphanumeric: {
          msg: "Model number must only contain letters and numbers"
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate:{
        max: {
          args: 1000,
          msg: "Capacity must be less than 1000"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Airplane',
  });
  return Airplane;
};
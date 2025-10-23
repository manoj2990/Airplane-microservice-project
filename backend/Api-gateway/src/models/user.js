'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/envirment-variable');



module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Role, 
        { 
        through:'User_Roles', 
        as: 'role',
        // foreignKey: 'userId',
        // otherKey: 'roleId'
        })

    }
  }
  User.init({
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true,
      validate: {
            isEmail: {
              msg: 'Please provide a valid email address.' 
            }
    }
  },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'User',
  });


User.addHook( 'beforeCreate', async (User)=>{
  const encryptedPass = await bcrypt.hash(User.password,+parseInt(SALT_ROUNDS));
  User.password = encryptedPass;
})


  return User;
};
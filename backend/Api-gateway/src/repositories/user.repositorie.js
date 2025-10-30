

const {User} = require('../models');
const CrudRepository = require('./crud.repositorie');


class UserRepository extends CrudRepository{
    constructor(){
        super(User)
    }


        async getUser(userId) {
    return await this.model.findByPk(userId, {
        attributes: { exclude: ['password'] }
    });
    }



  async getByEmail(email) {
  const response = await this.model.findOne({
    where: { email }
   
  });

  return response.dataValues
}



}


module.exports = UserRepository;
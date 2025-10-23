
const {Role} = require('../models');
const CrudRepository = require('./crud.repositorie');


class RoleRepository extends CrudRepository{
    constructor(){
        super(Role)
    }


    async getRoleByName(name){
       
        const role = await Role.findOne({ 
            where: { name: name } 
        });

        return role;
    }


}


module.exports = RoleRepository;
const CrudRepository = require('./crud-repositorie')
const {City} = require('../models')

class CityRepository extends CrudRepository{

    constructor(){
        super(City)
    }
}

module.exports = CityRepository;


const {StatusCodes} = require('http-status-codes');

const { CityRepository } = require('../repositories');
const ApiError = require('../utils/errors/app-error');

const cityRepositorie = new CityRepository();

async function createCity(data) {
    try {
        const response = await cityRepositorie.create(data);
        return response
    } catch (error) {
     
        // if(error.name == 'SequelizeUniqueConstraintError'){
        //     let explanation = []
        //     error.errors.forEach( (e)=>{
        //         explanation.push(e.message)
        //     })
        //      throw new ApiError(explanation, StatusCodes.BAD_REQUEST);
        // }

          if(error.name ==  'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = []
            error.errors.forEach( (e)=>{
                explanation.push(e.message);
            })
            throw new ApiError(explanation, StatusCodes.BAD_REQUEST);
        }

      throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getCities() {
    try {
        const response = await cityRepositorie.getAll();
        return response
    } catch (error) {
        throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getCity() {
    try {
        const response = await cityRepositorie.get(data);
        return response
    } catch (error) {
        throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



async function updateCity(id,data) {
    try {
        const response = await cityRepositorie.update(id,data);
        return response
    } catch (error) {
        throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}






module.exports = {
    createCity,
    getCities,
    getCity,
    updateCity
}
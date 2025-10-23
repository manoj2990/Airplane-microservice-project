const {StatusCodes} = require('http-status-codes');

const { AirplaneRepository } = require('../repositories');
const ApiError = require('../utils/errors/app-error');

const airplaneRepository = new AirplaneRepository();


async function createAirplane(data) {
   
     try {
        const airplane = await airplaneRepository.create(data);
    
        return airplane;
    } catch(error) {
        if(error.name ==  'SequelizeValidationError'){
            let explanation = []
            error.errors.forEach( (e)=>{
                explanation.push(e.message);
            })
            throw new ApiError(explanation, StatusCodes.BAD_REQUEST);
        }
       throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

    }
}


async function getAirplanes(){
    try {
        const response = await airplaneRepository.getAll();
        return response;
    } catch (error) {
        throw new ApiError('Failed to get airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getAirplane(id){
    try {
        const response = await airplaneRepository.get(id);
        
        if(response == null){
            throw new ApiError('Requested airplane not found', StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Failed to get airplane details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function deleteAirplane(id){
    try {
       
        const response = await airplaneRepository.destroy(id);
        if(response == 0){
            throw new ApiError('The airplane you requested to delete is not found', StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Failed to delete airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function updateAirplane(id,data){
    try {
        const response = await airplaneRepository.update(id,data);
        if(response == 0){
            throw new ApiError('The airplane you requested to update is not found', StatusCodes.NOT_FOUND);
        }

        return response;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Failed to update airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    deleteAirplane,
    updateAirplane
}
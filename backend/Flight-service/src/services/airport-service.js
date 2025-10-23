
const {StatusCodes} = require('http-status-codes');
const ApiError = require('../utils/errors/app-error');
const {AirportRepository} = require('../repositories/index')

const airportRepository = new AirportRepository();

async function createAirport(data) {

     try {
        const airoport = await airportRepository.create(data);
        
        return airoport;
    } catch(error) {
      
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


async function getAirports(){
    try {
        const airoports = await airportRepository.getAll();
        return airoports;
    } catch (error) {
        throw new ApiError('Cannot fetch data of all the airports', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getAirport(id){
    try {
        const airoport = await airportRepository.get(id);       
        
        if(airoport == null){
            throw new ApiError('Requested airport not found', StatusCodes.NOT_FOUND);
        }
        return airoport;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Failed to get airport details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function deleteAirport(id){
    try {
       
        const response = await airportRepository.destroy(id);
        if(response == 0){
            throw new ApiError('The airport you requested to delete is not found', StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Failed to delete airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function updateAirport(id,data){
    try {
        const response = await airportRepository.update(id,data);
        if(response == 0){
            throw new ApiError('The airport you requested to update is not found', StatusCodes.NOT_FOUND);
        }

        return response;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Failed to update airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createAirport,
    getAirports,
    getAirport,
    deleteAirport,
    updateAirport
}
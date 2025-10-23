
const { StatusCodes } = require('http-status-codes');

const { AirportService } = require('../services/index');
const {ErrorResponse,SuccessResponse} = require("../utils/common/index");



async function createAirport(req, res) {

try {
        const airoport = await AirportService.createAirport({
            name:req.body.name,
            code:req.body.code,
            address:req.body.address,
            cityId:req.body.cityId
        });
    
        SuccessResponse.data = airoport;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse)
               
    } catch(error) {
        
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
              

    }

}

async function getAirports(req,res){
    try {
        const airoport = await AirportService.getAirports();

        SuccessResponse.data = airoport;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

async function getAirport(req,res){
    try {
        const airoport = await AirportService.getAirport(req.params.id);

        SuccessResponse.data = airoport;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

async function deleteAirport(req,res){
    try {
        const response = await AirportService.deleteAirport(req.params.id);

        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

async function updateAirport(req,res){
    try {
        const response = await AirportService.updateAirport(req.params.id,req.body);

        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}


module.exports ={
    createAirport,
    getAirports,
    getAirport,
    deleteAirport,
    updateAirport
} 

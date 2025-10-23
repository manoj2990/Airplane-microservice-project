
const {StatusCodes} = require('http-status-codes');
const {ErrorResponse} = require("../utils/common/index");
const ApiError = require('../utils/errors/app-error');

function cityValidation(req,res,next) {
    if(!req.body.name){
       ErrorResponse.message = 'City name is required';
     ErrorResponse.error = new ApiError(["Error during city Validation validation"],StatusCodes.BAD_REQUEST);
    
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }

    next()
}


module.exports = {
    cityValidation
}
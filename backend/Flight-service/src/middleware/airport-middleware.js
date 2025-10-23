const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require("../utils/common/index");
const ApiError = require('../utils/errors/app-error');

function validateCreateReq(req, res, next) {
    
    const requiredFields = ['name', 'code', 'cityId'];


    const missingFields = requiredFields.filter((fild)=> fild !== req.body[fild])

    if(missingFields.length > 0){
        throw new ApiError(`${missingFields.join(', ')} is required`,StatusCodes.BAD_REQUEST)
    }


    // If everything is fine
    next();
}

module.exports = {
    validateCreateReq
};

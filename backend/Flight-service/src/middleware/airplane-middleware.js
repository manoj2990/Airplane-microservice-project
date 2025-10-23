const {StatusCodes} = require('http-status-codes');
const {ErrorResponse} = require("../utils/common/index");
const ApiError = require('../utils/errors/app-error');

function airplaneValidator(req, res, next) {
   
     if(!req.body.modelNumber) {
      
     ErrorResponse.message = 'modelNumber is required';
     ErrorResponse.error = new ApiError(["Error during modelNumber validation"],StatusCodes.BAD_REQUEST);
    
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

module.exports = {
    airplaneValidator
};


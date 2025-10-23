const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');



function validateAuthRequest(req, res, next) {
    if (!req.body.email) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['Email not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if (!req.body.password) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError(['password not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}




async function isAuth(req, res, next) {
   
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            throw new AppError('Missing JWT token in x-access-token header', StatusCodes.BAD_REQUEST);
        }
      
        const user = await UserService.isAuthenticated(token);
        if (!user) {
            throw new AppError('User not found for the provided token', StatusCodes.UNAUTHORIZED);
        }
      
      
         req.user= user.dataValues;
        next();
    } catch (error) {
        console.error("isAuth error:", error);
        if (error instanceof AppError) {
            ErrorResponse.error = error;
            return res.status(error.statusCode).json(ErrorResponse);
        }
        ErrorResponse.error = new AppError('Authentication failed', StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}



async function isAdmin(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            throw new AppError('User not authenticated', StatusCodes.UNAUTHORIZED);
        }
     
        const isAdmin = await UserService.isAdmin(req.user.id);
        if (!isAdmin) {
            throw new AppError('User is not an admin', StatusCodes.FORBIDDEN);
        }
        req.isAdmin = isAdmin;
        next();
    } catch (error) {
        console.error("isAdmin error:", error);
        if (error instanceof AppError) {
            ErrorResponse.error = error;
            return res.status(error.statusCode).json(ErrorResponse);
        }
        ErrorResponse.error = new AppError('Admin check failed', StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
module.exports = {
    validateAuthRequest,
    isAuth,
    isAdmin
}

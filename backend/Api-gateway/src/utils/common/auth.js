
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../errors/app-error');
const { StatusCodes } = require('http-status-codes');

const {JWT_SECRET,JWT_EXPIRES_IN} = require('../../config/envirment-variable');
function comparePassword({password,hashedPassword}){
   try {
     return bcrypt.compareSync(password,hashedPassword);
   } catch (error) {
    throw new AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR);
   }
}




function createToken({id,email}){
    try {
        const token = jwt.sign({id,email},JWT_SECRET,{
            expiresIn:JWT_EXPIRES_IN,
        });
        return token;
    } catch (error) {
        throw new AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



function verifyToken(token){
    try {
    
        const decoded = jwt.verify(token,JWT_SECRET);
        
        return decoded;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
         if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
       
        throw new AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR);
           
    }
}


module.exports = {
    comparePassword,
    createToken,
    verifyToken,
}

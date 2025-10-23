const { UserService } = require("../services");
const {SuccessResponse,ErrorResponse} = require("../utils/common");
const {StatusCodes} = require("http-status-codes");
const AppError = require("../utils/errors/app-error");

async function health (req, res){
   try {

    if(!req.userId) {
        throw new AppError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }
        
    return res
    .status(200)
    .json({
        message : 'Server is up and running',
        status : 'success',
    })
   } catch (error) {
        if(error instanceof AppError) {
            ErrorResponse.error = error.message;
            return res
            .status(error.statusCode)
            .json(ErrorResponse);
        };
        throw new AppError("Something went wrong while healthchecking user",StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

async function createUser(req,res){
    try {
       
        const user = await UserService.createUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })

    SuccessResponse.data = user;

    return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);

    } catch (error) {

        ErrorResponse.error = error;
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

async function signIn(req,res) {
    try {
        const token = await UserService.signIn({
            email: req.body.email,
            password: req.body.password,
        })

        SuccessResponse.data = token;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}


async function addRoleToUser(req,res){
    try {
      
        const user = await UserService.addRoleToUser({
            userId: req.body.userId,
            roleName: req.body.roleName,
        })

    SuccessResponse.data = user;

    return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);

    } catch (error) {

        ErrorResponse.error = error;
        return res
        .status(error.statusCode)
        .json(ErrorResponse);
    }
}


module.exports = {
    createUser,
    signIn,
    health,
    addRoleToUser
} 
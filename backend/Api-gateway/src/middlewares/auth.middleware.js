const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');




const protectedFlightRoutes = [
  { method: "POST", path: /^\/api\/v1\/flights$/ }, // create flight
  { method: "PATCH", path: /^\/api\/v1\/flights\/[^/]+$/ }, // update flight
  { method: "DELETE", path: /^\/api\/v1\/flights\/[^/]+$/ }, // delete flight

];



function conditionalAuth(req, res, next) {
    console.log(`calling cond midd --> ${req.method} ==> ${req.path}`);
  // Check if this request matches any of the protected routes
  const needsAuth = protectedFlightRoutes.some(
    (r) => req.method === r.method && r.path.test(req.path)
  );

  // If match found → call isAuth (normal JWT auth)
  if (needsAuth) {
    console.log("Conditional Auth: Authentication required for this route.");

    return isAuth(req, res, () => isAdmin(req, res, next));
  }

  // Otherwise → let the request pass without auth
  return next();
}





function validateLoginRequest(req, res, next) {
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


function validateSignUpRequest(req, res, next) {

    if (!req.body.name) {
        ErrorResponse.message = 'Something went wrong while creating user';
        ErrorResponse.error = new AppError(['Name not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if (!req.body.email) {
        ErrorResponse.message = 'Something went wrong while creating user';
        ErrorResponse.error = new AppError(['Email not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if (!req.body.password) {
        ErrorResponse.message = 'Something went wrong while creating user';
        ErrorResponse.error = new AppError(['password not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}




async function isAuth(req, res, next) {
   console.log("isAuth middleware called");
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            throw new AppError('Missing JWT token in x-access-token header', StatusCodes.BAD_REQUEST);
        }
      
        const user = await UserService.isAuthenticated(token);
        if (!user) {
            throw new AppError('User not found for the provided token', StatusCodes.UNAUTHORIZED);
        }

      console.log("Authenticated user:", user.dataValues);
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
    console.log("isAdmin middleware called");
    try {
        if (!req.user || !req.user.id) {
            throw new AppError('User not authenticated', StatusCodes.UNAUTHORIZED);
        }
        console.log("Checking admin status for user ID:", req.user.id);
        const isAdmin = await UserService.isAdmin(req.user.id);
        if (!isAdmin) {
            throw new AppError('User is not an admin', StatusCodes.FORBIDDEN);
        }
        console.log("User is an admin:", req.user.id);
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
    validateLoginRequest,
    validateSignUpRequest,
    conditionalAuth,
    isAuth,
    isAdmin
}

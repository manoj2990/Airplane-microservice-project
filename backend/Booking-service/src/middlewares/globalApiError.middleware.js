

const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/errors/app-error');
const { ErrorResponse } = require('../utils/common');

/**
 * Global API handler middleware for consistent error handling
 */
const globalApiErrorHandler = (err, req, res, next) => {
  console.log(`Error in API request: ${req.method} ${req.url}`);
  
  // Log the error details for debugging
  console.error("globalApiErrorHandlere", err);

  // Handle different types of errors
  if (err instanceof ApiError) {
    // Handle custom API errors
    ErrorResponse.error = {
      message: err.explanation || err.message,
      statusCode: err.statusCode
    };
    return res.status(err.statusCode).json(ErrorResponse);
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    ErrorResponse.error = {
      message: err.errors.map(e => e.message),
      code: StatusCodes.BAD_REQUEST
    };
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  // Handle Axios errors (for service communication)
  if (err.isAxiosError) {
    const statusCode = err.response?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.response?.data?.message || 'Error in external service communication';
    
    ErrorResponse.error = {
      message,
      code: statusCode
    };
    return res.status(statusCode).json(ErrorResponse);
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    ErrorResponse.error = {
      message: 'Invalid JSON payload',
      code: StatusCodes.BAD_REQUEST
    };
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  // Default error handler for unhandled errors
  ErrorResponse.error = {
    message: err.message || 'Something went wrong',
    code: StatusCodes.INTERNAL_SERVER_ERROR
  };
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
};

module.exports = globalApiErrorHandler;

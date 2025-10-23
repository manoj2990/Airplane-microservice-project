const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/errors/app-error');
const { ErrorResponse } = require('../utils/common');

const globalApiErrorHandler = (err, req, res, next) => {
  console.error(`❌ Error in API request: ${req.method} ${req.url}`);
  console.error('Error details:', err);

  // Prevent sending response if headers already sent
  if (res.headersSent) {
    console.warn('⚠️ Headers already sent, delegating to default error handler');
    return next(err);
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    ErrorResponse.error = {
      message: err.explanation || err.message,
      code: err.statusCode
    };
    return res.status(err.statusCode).json(ErrorResponse);
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    ErrorResponse.error = {
      message: 'Invalid JSON payload',
      code: StatusCodes.BAD_REQUEST
    };
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    ErrorResponse.error = {
      message: err.message,
      code: StatusCodes.BAD_REQUEST
    };
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  // Default error handler
  ErrorResponse.error = {
    message: err.message || 'Something went wrong',
    code: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  };
  
  return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
};

module.exports = globalApiErrorHandler;
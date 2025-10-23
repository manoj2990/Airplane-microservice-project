


// globalResponseHandler.js
const globalApiErrorHandler = (req, res, next) => {
    res.AppError = (statusCode, message, error) => {
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: error
      });
    };
    next();
  };
  
  module.exports = globalApiErrorHandler;
  
    
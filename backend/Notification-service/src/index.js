
const express = require("express");

const apiroutes = require("./routes/index.js");
const {GlobalApiErrorMiddleware} = require('./middlewares');
const {EmailService} = require('./services');
const {PORT,GMAIL_USER_EMAIL, QUEUE_NAME, RABBITMQ_URL } = require("./config/envirment-variable")
const app = express();


const amqplib = require('amqplib');
const { ErrorResponse } = require("./utils/common/index.js");
const {AppError} = require("./utils/errors/app-error.js")

(async () => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    channel.consume(QUEUE_NAME, (message) => {
        if (message !== null) {
       
           const data = JSON.parse(message.content.toString());
       
          
          EmailService.sendEmail(
            GMAIL_USER_EMAIL,
            data.recepientEmail, 
            data.subject, 
            data.content
           );
          console.log("Processing done!");
          channel.ack(message);
        }
      }, 
      { noAck: false } 
    );
  } catch (error) {
    ErrorResponse({
      message: "Error in consumer",
      error: error.message,
    });

    throw new AppError("Error in consumer", error.statusCode || 500);
  }
})();



// ============================================
// Body Parsing Middleware
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ============================================
// API Routes
// ============================================
app.use('/api', apiroutes);


// ============================================
// 404 Handler - Must be before error handler
// ============================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    error: 'Route not found'
  });
});

// ============================================
// Global Error Handler (MUST BE LAST)
// ============================================
app.use(GlobalApiErrorMiddleware);

// ============================================
// Start Server
// ============================================
const startServer = async () => {
  try {
     app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
       
    });

    
  } catch (error) {
    ErrorResponse({
      message: "Error in server",
      error: error.message,
    });
    
    throw new AppError("Error in server", error.statusCode || 500);
  }
};

startServer();
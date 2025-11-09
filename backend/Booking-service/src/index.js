
const express = require("express");
const {PORT} = require("./config/envirment-variable/index.js"); // Using alias for cleaner import
const apiroutes = require("./routes/index.js");
const { Queue } = require("./config/index.js");
const app = express();

const {RedisServer} = require("./config");

const scheduleCronJob = require("./utils/common/cron-job.js")
const { GlobalApiErrorHandler } = require('./middlewares/index.js');
const cors = require('cors')

const http = require("http");
 const { setup_socket } = require('./config/socket.js');


app.use(cors())
// Middleware for parsing JSON requests
app.use(express.json());
//middleware for parsing urlencoded requests
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiroutes);

//stocket.io setup 
const server = http.createServer(app); 
const io = setup_socket(server); 

io.on("connection", (socket) => {

   console.log("🟢 User connected:", socket.id); 

  socket.on("disconnect", () => { 
    console.log("🔴 User disconnected:", socket.id); 
  }); 

});


RedisServer.on("connect", () => {
  
  RedisServer.setex("Booking-service Database", 10000, "Booking-service Database connected");
});

RedisServer.on("error", (err) => {
  console.error("Redis error:", err);
});


// Use the global API error handler middleware
app.use(GlobalApiErrorHandler);

server.listen(PORT, "0.0.0.0", async() => {
  console.log(`Server running on port ${PORT}`);

  scheduleCronJob().then(() => {
    console.log("Cron job scheduled");
  }); 

  Queue.connectToQueue().then(() => {
    console.log("Connected to RabbitMQ");
  });
});

module.exports = io
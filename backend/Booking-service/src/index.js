
const express = require("express");
const {PORT} = require("./config/envirment-variable/index.js"); // Using alias for cleaner import
const apiroutes = require("./routes/index.js");
const { Queue } = require("./config/index.js");
const app = express();

const {RedisServer} = require("./config");

const scheduleCronJob = require("./utils/common/cron-job.js")
const { GlobalApiErrorHandler } = require('./middlewares/index.js');
const cors = require('cors')


app.use(cors())
// Middleware for parsing JSON requests
app.use(express.json());
//middleware for parsing urlencoded requests
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiroutes);




RedisServer.on("connect", () => {
  console.log("✅ Redis connected on port " + RedisServer.options.port);
  RedisServer.setex("Database", 10000, "Database connected");
});

RedisServer.on("error", (err) => {
  console.error("❌ Redis error:", err);
});


// Use the global API error handler middleware
app.use(GlobalApiErrorHandler);

app.listen(PORT, async() => {
  console.log(`✅ Server running on port ${PORT}`);

  scheduleCronJob().then(() => {
    console.log("✅ Cron job scheduled");
  }); 

  // Queue.connectToQueue().then(() => {
  //   console.log("✅ Connected to RabbitMQ");
  // });
});

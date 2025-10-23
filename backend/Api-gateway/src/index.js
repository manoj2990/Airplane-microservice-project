
const express = require("express");
const { PORT } = require("./config/envirment-variable/index.js");
const apiroutes = require("./routes/index.js");
const { RedisServer } = require("./config");
const { RateLimiterMiddleware, GlobalApiErrorMiddleware } = require("./middlewares");
const { ReverseProxy } = require("./config");

const app = express();

try {
    ReverseProxy(app);
} catch (error) {
    console.error("❌ Reverse proxy error:", error);
    throw error;
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RedisServer.on("connect", () => {
  console.log("✅ Redis connected on port " + RedisServer.options.port);
  RedisServer.setex("Database", 10000, "Database connected");
});

RedisServer.on("error", (err) => {
  console.error("❌ Redis error:", err);
});


app.use(RateLimiterMiddleware);
app.use('/api', apiroutes);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`,
        error: 'Route not found'
    });
});

app.use(GlobalApiErrorMiddleware);

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
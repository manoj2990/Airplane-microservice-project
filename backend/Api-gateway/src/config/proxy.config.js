// // config/ReverseProxy.js
// const { ProxyFactory: createServiceProxy } = require("../utils/common");
// const { isAuth } = require("../middlewares/auth.middleware");
// module.exports = function (app) {

//   app.use("/flightService",
//     createServiceProxy(
//       "flightService", 
//       "http://localhost:3000", 
//       "Flight Service"
//     ));
    
 
//    app.use("/bookingService", 
//      isAuth,
//      createServiceProxy(
//        "bookingService", 
//        "http://localhost:4000", 
//        "Booking Service" 
//     ))
    
// };



const { createProxyMiddleware } = require("http-proxy-middleware");
const { isAuth } = require("../middlewares/auth.middleware");

module.exports = function(app) {

    
    app.use(
        "/flightService",
        createProxyMiddleware({
            target: "http://localhost:3000", // Target service
            changeOrigin: true,
            pathRewrite: { "^/flightService": "" }, // Removes '/flightService' from path before proxying
            logLevel: 'debug',
            timeout: 30000,
            proxyTimeout: 30000,
        })
    );


     app.use(
        "/bookingService",
        isAuth, // Auth middleware
        createProxyMiddleware({
            target: "http://localhost:4000", 
            changeOrigin: true,
            pathRewrite: { "^/bookingService": "" }, 
            logLevel: 'debug',
            timeout: 30000,
            proxyTimeout: 30000,
            on: {
                proxyReq: (proxyReq, req) => {
                    // Forward user details to the target service
                     if (req.user) {
                    // Convert user object to string (like JSON)
                    proxyReq.setHeader('x-user-info', JSON.stringify(req.user));
                    }
                },
                error: (err, req, res) => {
                
                    if (!res.headersSent) {
                        res.status(502).json({
                            success: false,
                            message: `Booking Service is currently unavailable`,
                            error: err.message,
                            service: "Booking Service"
                        });
                    }
                }
            }
        })
    );
    
};

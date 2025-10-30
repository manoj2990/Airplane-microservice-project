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
const { isAuth, conditionalAuth } = require("../middlewares/auth.middleware");
const {  FLIGHT_SERVICE_URL, BOOKING_SERVICE_URL, TIMEOUT, PROXY_TIMEOUT ,API_GATEWAY_INTERNAL_SECRET} = require("./envirment-variable");



module.exports = function(app) {

   
    app.use(
        "/flightService",
        conditionalAuth, // Conditional Auth middleware
        createProxyMiddleware({
            target: `${FLIGHT_SERVICE_URL}`, // Target service
            changeOrigin: true,
            pathRewrite: { "^/flightService": "" }, // Removes '/flightService' from path before proxying
            logLevel: 'debug',
            timeout: Number(TIMEOUT),
            proxyTimeout: Number(PROXY_TIMEOUT),
            on: {
                proxyReq: (proxyReq, req) => {
                     proxyReq.setHeader("x-internal-secret", API_GATEWAY_INTERNAL_SECRET);
                }
            },
        })
    );


     app.use(
        "/bookingService",
        isAuth, // Auth middleware
        createProxyMiddleware({
            target: `${BOOKING_SERVICE_URL}`, // Target service
            changeOrigin: true,
            pathRewrite: { "^/bookingService": "" }, 
            logLevel: 'debug',
            timeout: Number(TIMEOUT),
            proxyTimeout: Number(PROXY_TIMEOUT),
            on: {
                proxyReq: (proxyReq, req) => {
                    // Forward user details to the target service
                     if (req.user) {
                    // Convert user object to string (like JSON)
                    proxyReq.setHeader('x-user-info', JSON.stringify(req.user));
                    }
                    console.log("leaving apigatway---------------------->")
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

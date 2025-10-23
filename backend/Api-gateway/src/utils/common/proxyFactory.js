// const { createProxyMiddleware } = require("http-proxy-middleware");

// function createServiceProxy(path, target, serviceName) {
//     console.log("entring createServiceProxy------->")
//   if (!path || !target || !serviceName) {
//     throw new Error("Path, target, and serviceName are required");
//   }

//   return createProxyMiddleware({
//     target,
//     changeOrigin: true,
//     pathRewrite: { [`^/${path}`]: "" },
//     logLevel: 'debug',
//     timeout: 30000,
//     proxyTimeout: 30000,
//     on:{

//        ProxyReq: (proxyReq, req, res) => {
//             console.log(`[${serviceName}] onProxyReq:`, {
//                 method: req.method,
//                 url: req.originalUrl,
//                 headers: req.headers
//             });

//               if (req.user) {
//                     // Convert user object to string (like JSON)
//                     proxyReq.setHeader('x-user-info', JSON.stringify(req.user));
//                     }
//         },

//       error: (err, req, res) => {
//             console.error(`[${serviceName}] Proxy error:`, err.message, err.code);
//             if (!res.headersSent) {
//                 res.status(502).json({
//                     success: false,
//                     message: `${serviceName} is currently unavailable`,
//                     error: err.message,
//                     service: serviceName
//                 });
//             }
//         },
    
  
   
//     }
    


//   });
// }

// module.exports = createServiceProxy;
const { Router } = require("express");
const router = Router();



const userRoutes = require('./user.routes.js');
const { AuthMiddleware } = require("../../middlewares");
const { UserController } = require("../../controllers");



router.get('/healthcheck',
    // AuthMiddleware.validateAuthRequest, 
    
    AuthMiddleware.isAuth,
    AuthMiddleware.isAdmin,
    UserController.health
);
router.use('/user', userRoutes);




module.exports = router;

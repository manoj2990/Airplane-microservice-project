
const Router = require('express');
const { AuthMiddleware } = require("../../middlewares");

const router = Router();


const {UserController} = require("../../controllers");

router.post("/singup",UserController.createUser);
router.post("/signin",UserController.signIn);
router.post("/addrole",
    AuthMiddleware.isAuth,
    AuthMiddleware.isAdmin,
    UserController.addRoleToUser);

module.exports = router;

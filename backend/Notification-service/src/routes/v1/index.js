const { Router } = require("express");
const router = Router();

const emailRoutes = require('./emila.routes');

router.use('/emails',emailRoutes);



module.exports = router;

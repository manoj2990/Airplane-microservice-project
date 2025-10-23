
const { Router } = require("express");
const router = Router();

const {EmailController} = require('../../controllers');


router.post('/create',EmailController.createEmail);
router.get('/pending',EmailController.getPendingEmails);



module.exports = router;

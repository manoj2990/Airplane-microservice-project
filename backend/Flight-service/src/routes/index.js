const express = require('express');

const v1Routes = require('./v1');

const router = express.Router();

// http://localhost:3000/api/v1
router.use('/v1', v1Routes);

module.exports = router;
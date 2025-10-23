
const express = require('express');
const { CityController } = require('../../controllers');
const { CityMiddlewares } = require('../../middleware');


    

const router = express.Router();

router.post('/',
    CityMiddlewares.cityValidation,
    CityController.createCity)

module.exports = router;
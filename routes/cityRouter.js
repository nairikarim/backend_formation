const express = require('express');
const router=express.Router();
const cityContoller =require('../controllers/cityController');

router.post('/addCity',cityContoller.addCity);

module.exports=router;
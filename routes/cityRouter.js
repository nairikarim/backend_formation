const express = require('express');
const router=express.Router();
const cityContoller =require('../controllers/cityController');
const upload =require('../middlewares/uploadFile');


router.post('/addCity', upload.array("images"), cityContoller.addCity);
router.get('/getActivitiesByCity/:cityId', cityContoller.getActivitiesByCity);
router.get('/getCityById/:cityId', cityContoller.getCityById);
router.get('/getllCities', cityContoller.getllCities);

module.exports=router;
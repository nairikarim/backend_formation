
const express = require('express');
const router=express.Router();
const favoriscontroller =require('../controllers/favorisControllers');


router.post('/createFavoris', favoriscontroller.createFavoris);
router.get('/getUserFavoris/:userId', favoriscontroller.getUserFavoris);
router.get('/check/:userId/:activityId', favoriscontroller.checkFavoris);
router.delete('/deleteFavoris', favoriscontroller.deleteFavoris);

module.exports=router;

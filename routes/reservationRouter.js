const express = require('express');
const router=express.Router();
const cityContoller =require('../controllers/reservationController');

router.post('/affectReservation',cityContoller.affectReservation);
router.get('/getallReservation',cityContoller.getallReservation);
router.get('/getReservationByid/:id',cityContoller.getReservationByid);
router.get('/getReservationByActivityId/:activityId',cityContoller.getReservationByActivityId);
router.put('/desaffectReservation',cityContoller.desaffectReservation);


module.exports=router;
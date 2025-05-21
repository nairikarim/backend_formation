const express = require('express');
const router=express.Router();
const reservationController =require('../controllers/reservationController');
const { requireAuthUser, isAdmin } = require('../middlewares/authMiddleware');

router.post('/affectReservation',reservationController.affectReservation);
router.get('/getallReservation',reservationController.getallReservation);
router.get('/getReservationByid/:id',reservationController.getReservationByid);
router.get('/getReservationByActivityId/:activityId',reservationController.getReservationByActivityId);
router.put('/desaffectReservation',reservationController.desaffectReservation);
router.get('/getUserReservations/:userId/:etat', reservationController.getUserReservations);
router.put('/updateReservationEtat/:reservationId', reservationController.updateReservationEtat);


module.exports=router;
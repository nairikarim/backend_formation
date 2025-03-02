const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.post('/addActivity',activityController.addActivity);
router.get('/getallActivities',activityController.getallActivities);
router.get('/getActivityByid/:id',activityController.getActivityByid);
router.put('/updateActivityByid/:id',activityController.updateActivityByid);
router.delete('/deleteActivityByid/:id',activityController.deleteActivityByid);
router.put('/affect',activityController.affect);
router.put('/desaffect',activityController.desaffect);







module.exports = router;

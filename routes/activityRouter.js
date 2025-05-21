const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const upload =require('../middlewares/uploadFile');



router.post('/addActivity',  upload.array("images"), activityController.addActivity);
router.get('/getallActivities',activityController.getallActivities);
router.get('/getActivityByid/:id',activityController.getActivityByid);
router.put('/updateActivityByid/:id',activityController.updateActivityByid);
router.delete('/deleteActivityByid/:id',activityController.deleteActivityByid);
router.put('/affect',activityController.affect);
router.put('/desaffect',activityController.desaffect);
router.get('/search/',activityController.search);
router.post('/deepsearch', activityController.deepsearch);
router.get('/getPopularActivities',activityController.getPopularActivities);
// Sending city and userId as route parameters
router.get('/getrecommendedActivities/:userid/:city', activityController.getecommendedActivities);







module.exports = router;

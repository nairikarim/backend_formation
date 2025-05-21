
const express = require('express');
const router=express.Router();
const Notificationconttoller = require('../controllers/notifcationController');

router.get('/getallNotfication/:userid',Notificationconttoller.getUserNotifications);
router.delete('/DeleteNotfication',Notificationconttoller.deleteNotification);
module.exports=router;

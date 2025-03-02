const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.post('/addService',serviceController.addService);
router.get('/getallServices',serviceController.getallServices);
router.get('/getServiceByid/:id',serviceController.getServiceByid);
router.put('/updateServiceByid/:id',serviceController.updateServiceByid)
router.delete('/deleteServiceByid/:id',serviceController.deleteServiceByid)
router.put('/affectService',serviceController.affectService);
router.put('/desaffect',serviceController.desaffect);






module.exports = router;

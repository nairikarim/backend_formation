const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const {requireAuthUser} =require('../middlewares/authMiddleware');

// Route pour ajouter un avis - avec middleware d'authentification
router.post('/addAvis', avisController.addAvis);
router.get('/getAvisForActivity/:activityId', avisController.getAvisForActivity);


module.exports = router;

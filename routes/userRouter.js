const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload =require('../middlewares/uploadFile');
// Route pour ajouter un utilisateur
router.post('/addUserClient', userController.addUserClient);
router.post('/addUserAdmin', userController.addUserAdmin);
router.get('/getallUser', userController.getallUser);
router.get('/getUserByid/:id', userController.getUserByid);
router.delete('/deleteUserById/:id', userController.deleteUserById);
router.put('/updateuserById/:id', userController.updateuserById);

router.post('/addUserClientwithImg',upload.single("user_image"), userController.addUserClientwithImg);






module.exports = router;

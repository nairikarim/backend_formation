const userModel = require('../models/userSchema');


module.exports.addUserClient =async (req,res) => {
    try{
            const {username,email ,password } =req.body;
            const roleClient ='client'
            const user = await userModel.create({
                username,
                email,
                password,
                role :roleClient,
            });
            
            res.status(200).json({user});
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}
module.exports.addUserAdmin =async (req,res) => {
    try{
            const {username,email ,password } =req.body;
            const roleAdmin ='admin'
            const user = await userModel.create({
                username,
                email,
                password,
                role :roleAdmin,
            });
            
            res.status(200).json({user});
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}

module.exports.getallUser =async (req,res) => {
    try{
            const userListe = await userModel.find()
            
            res.status(200).json({userListe});
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}

module.exports.getUserByid =async (req,res) => {
    try{
            const {id} = req.params
            const userListe = await userModel.findById(id)
            
            res.status(200).json({userListe});
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}

module.exports.deleteUserById =async (req,res) => {
    try{
            const {id} = req.params;

            const checkIfuserExists = await userModel.findById(id) ;

            if( !checkIfuserExists ){
                throw new Error("user not found");
            }
            await userModel.findByIdAndDelete(id);

  

            res.status(200).json("deleted");
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}
module.exports.addUserClientwithImg =async (req,res) => {
    try{
            const {username,email ,password } =req.body;
            const roleClient ='client'
            const {filename} = req.file
            const user = await userModel.create({
                username,
                email,
                password,
                role :roleClient,
                user_image:filename
            });
       
            
            res.status(200).json({user});
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}

module.exports.updateuserById = async (req, res) => {
    try {
        const {id} = req.params
        const {email , username} = req.body;
    
        await userModel.findByIdAndUpdate(id,{$set : {email , username }})
        const updated = await userModel.findById(id)
    
        res.status(200).json({updated})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    }










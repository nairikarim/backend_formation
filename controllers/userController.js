const userModel = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const maxTime = 24*60 *60 //24H
const createtoken = (id,role) =>{
    return jwt.sign({id,role},'net secret pfe',{expiresIn: maxTime})
}
//67b1b1c906d5b758e9b22ac4 + net secret pfe +1M

module.exports.addUserClient =async (req,res) => {
    try{
            const {username,email ,phone ,password } =req.body;
            const roleClient ='client'
            const user = await userModel.create({
                username,
                email,
                phone,
                password,
                role :roleClient,
            });
            const token = createtoken(user._id,roleClient);
            res.cookie("jwt_token_triply", token, {httpOnly:false,maxAge:maxTime * 1000})
            res.status(200).json({ user, token });
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}
module.exports.addUserAdmin =async (req,res) => {
    try{
            const {username,email ,password } =req.body;
            const roleClient ='admin'
            const user = await userModel.create({
                username,
                email,
                password,
                role :roleClient,
            });
            const token = createtoken(user._id,roleClient);
            res.cookie("jwt_token_triply", token, {httpOnly:false,maxAge:maxTime * 1000})
            res.status(200).json({ user, token });
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}
module.exports.addUserPartner =async (req,res) => {
    try{
            const {username,email ,password } =req.body;
            const roleAdmin ='Partner'
            const user = await userModel.create({
                username,
                email,
                password,
                role :roleAdmin,
            });
            const token = createtoken(user._id,roleAdmin);
            res.cookie("jwt_token_triply", token, {httpOnly:false,maxAge:maxTime * 1000})
            res.status(200).json({ user, token });
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}

module.exports.getallUser =async (req,res) => {
    console.log("t3adit");
    
    try{
            const userListe = await userModel.find()
            console.log(userListe, "data");
            
            
            
            
           res.status(200).json({userListe});

          
    } catch(error) {
        console.log(error);
        
        res.status(500).json({message : error.message});
    }
}

module.exports.getUserByid = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select('-password'); 
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            success: true,
            user
            
        });
    } catch(error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
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
        const {email , username ,phone} = req.body;
    
        await userModel.findByIdAndUpdate(id,{$set : {email , username ,phone}})
        const updated = await userModel.findById(id)
    
        res.status(200).json({updated})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    }


module.exports.login= async (req,res) => {
    try {
        const { email , password } = req.body;
        const user = await userModel.login(email, password)
        const token = createtoken(user._id);
        res.cookie("jwt_token_triply", token, {httpOnly:false,maxAge:maxTime * 1000})
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.loginpartner= async (req,res) => {
    try {
        const { email , password } = req.body;
        const user = await userModel.loginpartner(email, password)
        const token = createtoken(user._id);
        res.cookie("jwt_token_triply", token, {httpOnly:false,maxAge:maxTime * 1000})
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports.login= async (req,res) => {
    try {
        const { email , password } = req.body;
        const user = await userModel.login(email, password)
        const token = createtoken(user._id);
        res.cookie("jwt_token_triply", token, {httpOnly:false,maxAge:maxTime * 1000})
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports.logout = async (req, res) => {
    try {
        res.cookie("jwt_token_triply", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax", 
            expires: new Date(0) 
        });

        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};














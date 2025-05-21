const jwt = require('jsonwebtoken');
const userModel = require('../models/userSchema');

const requireAuthUser = (req, res, next) => {
    console.log("header auth ", req.headers['authorization']);
    
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  // Extract token after 'Bearer'

    if (token) {
        // Vérifier le token
        jwt.verify(token, 'net secret pfe', async (err, decodedToken) => {
            if (err) {
                console.log("Erreur avec le token:", err.message);
                return res.status(401).json({ message: "Token invalid" });
            } else {
                // Trouver l'utilisateur correspondant à l'ID du token
                try {
                    const user = await userModel.findById(decodedToken.id);
                    console.log("User found:", user);
                    
                    if (user.role === "admin") {
                        req.user = user;  // Attacher l'utilisateur à la requête
                        return next();  // Passer à la suite
                    } else {
                        return res.status(404).json({ message: "User not allowed" });
                    }
                } catch (err) {
                    return res.status(500).json({ message: "Error finding user" });
                }
            }
        });
    } else {
        // Pas de token, renvoyer une erreur
        return res.status(401).json({ message: "No token provided" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // ✅ OK, c’est un admin
    } else {
        return res.status(403).json({ message: 'Accès refusé : admin uniquement.' });
    }
};

module.exports = { requireAuthUser, isAdmin };

const Favoris = require('../models/favorisSchema');
const User = require('../models/userSchema');
const Activity = require('../models/activitySchema');
// Créer un favori
exports.createFavoris = async (req, res) => {
    try {
        const { userId, activityId } = req.body;
        
        const nouveauFavori = await Favoris.create({
            user: userId,
            activity: activityId
        });

        await Activity.findByIdAndUpdate(activityId, {
            $push: { favoris:  nouveauFavori._id  }
          });  

        await User.findByIdAndUpdate(userId, {
            $push: { favoris: activityId  }
          });

        res.status(201).json({
            success: true,
            data: nouveauFavori
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Cet élément est déjà dans vos favoris"
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getUserFavoris = async (req, res) => {
    try {
        
        const favoris = await Favoris.find({ user: req.params.userId })
                                   .populate('activity')
                                   .lean();
        
        res.status(200).json({
            success: true,
            count: favoris.length,
            data: favoris
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteFavoris = async (req, res) => {
    try {
        const { userId, activityId } = req.body;
        console.log("Suppression - userId:", userId, "activityId:", activityId); // Debug

        // 1. Supprimer le favori de la collection Favoris
        const favori = await Favoris.findOneAndDelete({
            user: userId,
            activity: activityId
        });
        if (!favori) {
            return res.status(404).json({
                success: false,
                message: "Favori non trouvé"
            });
        }

        // 2. Retirer l'utilisateur des favoris de l'activité
        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            { $pull: { favoris: favori._id } },
            { new: true } // Retourne le document mis à jour
        );
        if (!updatedActivity) {
            console.log("Avertissement : Activité non trouvée");
        }

        // 3. Retirer l'activité des favoris de l'utilisateur
        await User.findByIdAndUpdate(userId, {
            $pull: { favoris: activityId }
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error("Erreur globale:", error); // Debug
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Vérifier si un élément est favori
exports.checkFavoris = async (req, res) => {
    try {
        const { userId, activityId } = req.params;
        
        const count = await Favoris.countDocuments({
            user: userId,
            activity: activityId
        });
        
        res.status(200).json({
            success: true,
            isFavorite: count > 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
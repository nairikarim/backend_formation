const reservationModel = require('../models/reservationSchema');
const activityModel = require('../models/activitySchema');
const userModel = require('../models/userSchema');
const mongoose = require('mongoose');

module.exports.affectReservation = async (req, res) => {
    try {
        const { userId, activityId} = req.body;

        // Vérifier si l'activité existe
        const activityById = await activityModel.findById(activityId);
        if (!activityById) {
            throw new Error('Activité introuvable');
        }

        // Vérifier si l'utilisateur existe
        const userById = await userModel.findById(userId);
        if (!userById) {
            throw new Error('Utilisateur introuvable');
        }

        // Créer une nouvelle réservation
        const newReservation = new reservationModel({
            user: userId,
            activity: activityId,
           
        });

        // Sauvegarder la réservation
        await newReservation.save();

        // Mettre à jour l'activité pour l'associer à la réservation
        await activityModel.findByIdAndUpdate(activityId, {
            $push: { reservations: newReservation._id }
        });

        // Mettre à jour l'utilisateur pour ajouter la réservation
        await userModel.findByIdAndUpdate(userId, {
            $push: { reservations: newReservation._id }
        });

        res.status(200).json("Réservation affectée avec succès");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getallReservation = async (req, res) => {
    try {
        reservationList = await reservationModel.find();

        if (!reservationList || reservationList.length === 0) {
            throw new Error('Aucun Reservation trouvé');
        }

        res.status(200).json({ reservationList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getReservationByid =async (req,res) => {
    try{
            const {id} = req.params
            const reservationByid = await reservationModel.findById(id)
            
            res.status(200).json({reservationByid});
    } catch(error) {
        res.status(500).json({message : error.message});
    }
}
module.exports.getReservationByActivityId = async (req, res) => {
    try {
        const { activityId } = req.params;

        // Vérifier si l'activité existe
        const activity = await activityModel.findById(activityId);
        console.log(activity);
        if (!activity) {
            return res.status(404).json({ message: 'Activité introuvable' });
        }

        // Récupérer toutes les réservations associées à cette activité
        const reservations = await reservationModel.find({ activity: activityId }).populate('user');

        // Toujours renvoyer un tableau, même s'il est vide
        res.status(200).json( reservations );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports.desaffectReservation = async (req, res) => {
    try {
        const { userId, activityId } = req.body;

      

        // Vérifier si l'activité existe
        const activity = await activityModel.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activité introuvable' });
        }

        // Vérifier si l'utilisateur existe
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        // Vérifier si une réservation existe pour cet utilisateur et cette activité
        const reservation = await reservationModel.findOne({ user: userId, activity: activityId });
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation introuvable' });
        }

        // Supprimer la réservation
        await reservationModel.findByIdAndDelete(reservation._id);

        // Retirer la réservation de l'activité
        await activityModel.findByIdAndUpdate(activityId, {
            $pull: { reservations: userId }
        });

        // Retirer la réservation de l'utilisateur
        await userModel.findByIdAndUpdate(userId, {
            $pull: { reservations: activityId }
        });

        res.status(200).json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};




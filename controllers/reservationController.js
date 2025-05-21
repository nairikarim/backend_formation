const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const Activity = require('../models/activitySchema');
const Reservation = require('../models/reservationSchema');
const Notfication =require('./notifcationController');

// Middleware to verify token and extract userId
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token using the secret key
    req.userId = decoded.userId; // Extract userId from the token payload
    next(); // Pass control to the next handler
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
}

module.exports.affectReservation = async (req, res) => {
  console.log("sameone ");
  
  try {
    const { DateR, participants, firstname,lastname, email, phone,city,activityId,userId } = req.body;

  

    const activity = await Activity.findById(activityId);
    const createdBy =activity.createdBy
     console.log(createdBy);
     
    if (!activity) throw new Error("Activity not found");



   

    const pricePerPerson = parseFloat(activity.price);
    const numParticipants = parseInt(participants);
    const totalPrice = pricePerPerson * numParticipants;
    const etat ='en cours';
    const newReservation = new Reservation({
      DateR,
      participants,
      firstname,
      lastname,
      email,
      phone,
      city,
      etat: etat,
      user:userId, // Directly use userId from token
      activity: activityId,
      createdBy:createdBy
    });

    await newReservation.save();
    await Notfication.createNotification({
      body: {
        title: 'Nouvelle réservation',
        description: `Une réservation pour l'activité "${activity.title}" a été effectuée.`,
        userId: userId 
      }
    }, { status: () => ({ json: () => {} }) });


    // Update activity and user collections
    await Activity.findByIdAndUpdate(activityId, {
      $push: { reservations: newReservation._id }
    });

    await User.findByIdAndUpdate(userId, {
      $push: { reservations: newReservation._id }
    });



    res.status(201).json({
      message: "Reservation successful",
      prixTotal: totalPrice,
      reservation: newReservation
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



module.exports.getallReservation = async (req, res) => {


  try {
    const { createdBy, role } = req.query; // or req.user.id if you're using auth
 console.log(createdBy,"didiidd",role);
 if (role =="admin") {
  const reservations = await Reservation.find().populate('activity'); 
  console.log(reservations);
  
  return   res.status(200).json({ reservations });
}
    const reservations = await Reservation.aggregate([
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activity',
        },
      },
      { $unwind: '$activity' },
      {
        $match: {
          'activity.createdBy': new mongoose.Types.ObjectId(createdBy)
        },
      },
      {
        $project: {
          _id: 1,
          dateR: 1,
          participants: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          phone: 1,
          city: 1,
          etat: 1,
          user: 1,
          title: '$activity.title',

          activity: '$activity',
        },
      },
    ]);

    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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






exports.getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { etat } = req.params; // Optionnel : "en cours", "confirmée", "passée"

    const user = await User.findById(userId).populate({
      path: 'reservations',
      model: 'Reservation',
      match: etat ? { etat } : {}, // Filtre par état si spécifié
      populate: {
        path: 'activity',
        model: 'Activity',
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(user.reservations);
  } catch (error) {
    console.error("Erreur récupération réservations:", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
exports.updateReservationEtat = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { newEtat } = req.body;

    // Vérifie si la réservation existe
    const reservation = await Reservation.findById(reservationId).populate('activity');
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Met à jour l’état
    const activity = reservation.activity;
    reservation.etat = newEtat;

    await reservation.save();
    await Notfication.createNotification({
      body: {
        title: `réservation ${newEtat}`,
        description: `Une réservation pour l'activité "${activity.title}" a été effectuée.`,
        userId:     reservation.user  
      }
    }, { status: () => ({ json: () => {} }) });


    res.status(200).json({
      message: 'État de la réservation mis à jour avec succès.',
      reservation
    });
  } catch (error) {
    console.error('Erreur update etat reservation:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

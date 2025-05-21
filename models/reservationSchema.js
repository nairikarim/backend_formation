const mongoose = require('mongoose');
const User = require('./userSchema'); // Importer le modèle User
const Activity = require('./activitySchema');

const reservationSchema = new mongoose.Schema({
    DateR: { type: String, required: true },
    participants: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    city: { type: String, required: true },
    etat: {
        type: String,
        enum: ["en cours", "confirmée", "passée", "annulée"],
        default: "en cours"
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User",  }, 
    activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity",  },
   createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User",},
});

// Middleware avant de sauvegarder la réservation
reservationSchema.pre('save', async function (next) {
    try {
        

       

        next();
    } catch (error) {
        next(error);
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;

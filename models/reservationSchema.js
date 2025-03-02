const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;

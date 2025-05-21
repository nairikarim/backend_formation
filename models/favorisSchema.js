const mongoose = require('mongoose');

const favorisSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    activity: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Activity', 
        required: true 
    }
}, { 
    timestamps: true 
});

// Index unique pour éviter les doublons
favorisSchema.index({ user: 1, activity: 1 }, { unique: true });

const Favoris = mongoose.model('Favoris', favorisSchema);
module.exports = Favoris;
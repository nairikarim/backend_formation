const mongoose = require('mongoose');
const User = require('./userSchema');

const avisSchema = new mongoose.Schema(
  {   
    Texte: { type: String, required: true },
    Notes: { type: Number, required: true, min: 1, max: 5 },
    DateAvis: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }, 
  },
  { timestamps: true }
);

const Avis = mongoose.model('Avis', avisSchema);
module.exports = Avis;

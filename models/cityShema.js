const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true }, // "Paris"
  description: { type: String, required: true }, // "Capitale de la France"
  images : { type: Array ,required: true},
  activities: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Activity" 
  }]
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);



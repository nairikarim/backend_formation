const mongoose = require('mongoose');


const activitySchema = new mongoose.Schema(
    {   
        title : {type :String ,required :true },
        location: {type : String ,required :true},
        description: { type: String, required: true },
        inclus: { type: String, required: true },
        Point_Forts: { type: String, required: true },
        lieu_de_rendez_vous: { type: String, required: true },
        date: { type: Date, required: true },
        price: { type: String, required: true },


        typeActivitiy: { 
            type :String  ,required: true  },
        mainimage: { type: String, required: false, default: 'activité.png' },
        images : { type: Array ,required: true},
        reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "reservation",  }],
        avis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Avis",}],
        createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User",},
     
        favoris: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'  // Maintenant, ce sont des userId
        }],
        city: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "City", 
            required: true 
          },

    },
    { timestamps: true }
);


const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
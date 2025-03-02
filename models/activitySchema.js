const mongoose = require('mongoose')

const activitySchema =new mongoose.Schema(
    {
        activityname: { type: String, required: true },
        activity_image: { type: String, required: false, default: 'activity.png' },
        description: { type: String, required: true },
        dateDispo: {type:Date, required :true},
        city: {type:mongoose.Schema.Types.ObjectId,ref :'City'},
        reservation: [{type : mongoose.Schema.Types.ObjectId,ref : 'reservation'}],
        
      },
      { timestamps: true }
    );
    


activitySchema.post("save",async function(req,res,next){
    console.log(" new user was created & saved successfully")
})
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
const mongoose = require('mongoose');

const citySchema  = new  mongoose.Schema(
    {

        cityname: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        activities : [{type : mongoose.Schema.Types.ObjectId,ref : 'Activity'}] ,//one to many 
        services : [{type : mongoose.Schema.Types.ObjectId,ref : 'Service'}] //one to many 

    
    },
{ timestamps: true });

citySchema.post("save", async function(req,res,next){
    console.log("new city was created & saved successfully")
})


const City=mongoose.model('City',citySchema);
module.exports=City;

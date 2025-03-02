const mongoose = require('mongoose')

const activitySchema =new mongoose.Schema(
    {
        servicename: { type: String, required: true },
        category :{ type: String, required: true },
        service_image: { type: String, required: false, default: 'service.png' },
        contactInfo:{ type: String, required: true },
        discount: {type:Number, required :true},
        city: {type:mongoose.Schema.Types.ObjectId,ref :'City'},
                
      },
      { timestamps: true }
    );
    

const Service = mongoose.model('Service', activitySchema);
module.exports = Service;
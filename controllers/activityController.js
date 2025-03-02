const activityModel = require('../models/activitySchema')
const cityModel = require('../models/cityShema')
 
module.exports.addActivity = async (req, res) => {
    try {
        const { activityname, description, destination, dateDispo } = req.body;
        const activity = await activityModel.create({
            activityname,
            description,
            destination,
            dateDispo

        });

        res.status(200).json({ activity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getallActivities = async (req, res) => {
    try {
        activitiesList = await activityModel.find();

        if (!activitiesList || activitiesList.length === 0) {
            throw new Error('Aucun Activité trouvé');
        }

        res.status(200).json({ activitiesList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getActivityByid = async (req, res) => {
    try {
        const { id } = req.params
        activitiesList = await activityModel.findById(id)

        if (!activitiesList || activitiesList.length === 0) {

            throw new Error('Activité introuvable');
        }

        res.status(200).json({ activitiesList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.updateActivityByid = async (req, res) => {
    try {
        const { id } = req.params
        const { activityname, description, destination, dateDispo } = req.body
        activityByid = await activityModel.findByIdAndUpdate(id, { $set: { activityname, description, destination, dateDispo } })
        if(!activityByid  ){

            throw new Error('Activité introuvable');
        }
        updated = await activityModel.findById(id)
         

        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.deleteActivityByid = async (req, res) => {
    try {
        const { id } = req.params
        activityByid= await activityModel.findByIdAndDelete(id)
        
        if(!activityByid  ){

            throw new Error('Activité introuvable');
        }
        res.status(200).json("activity deleted ");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.affect = async (req, res) => {
    try {
        const { cityId, activityId } = req.body;

        
        const activityByid = await activityModel.findById(activityId);
        
        if(!activityByid){

            throw new Error('Activité introuvable');
        }

        const cityByid= await cityModel.findById(cityId);

        if(!cityByid  ){

            throw new Error('ville introuvable');
        }

        await activityModel.findByIdAndUpdate(activityId, {
            $set: { city : cityId },
          });
      
        await cityModel.findByIdAndUpdate(cityId, {
            $push: { activities: activityId },
          });


        res.status(200).json(" affected ");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.desaffect = async (req, res) => {
    try {
        const { cityId, activityId } = req.body;

        
        const activityByid = await activityModel.findById(activityId);
        
        if(!activityByid){

            throw new Error('Activité introuvable');
        }

        const cityByid= await cityModel.findById(cityId);

        if(!cityByid  ){

            throw new Error('ville introuvable');
        }

        await activityModel.findByIdAndUpdate(activityId, {
            $unset: { city : cityId },
          });
      
        await cityModel.findByIdAndUpdate(cityId, {
            $remove: { activity: activityId },
          });


        res.status(200).json(" desaffected ");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}






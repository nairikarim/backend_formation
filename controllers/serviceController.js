const serviceModel = require('../models/serviceSchema')
const cityModel = require('../models/cityShema')
 

        
module.exports.addService = async (req, res) => {
    try {
        const { servicename,  category, contactInfo ,discount} = req.body;
        const service = await serviceModel.create({
            servicename,
            category,
            contactInfo,
            discount,

        });

        res.status(200).json({ service });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getallServices = async (req, res) => {
    try {
        servicesList = await serviceModel.find();

        if (!servicesList || servicesList.length === 0) {
            throw new Error('Aucun Service trouvé');
        }

        res.status(200).json({ servicesList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getServiceByid = async (req, res) => {
    try {
        const { id } = req.params
        servicesList = await serviceModel.findById(id)

        if (!servicesList || servicesList.length === 0) {

            throw new Error('Service introuvable');
        }

        res.status(200).json({ servicesList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateServiceByid = async (req, res) => {
    try {
        const { id } = req.params
        const { servicename, category,discount  } = req.body
        serviceByid = await serviceModel.findByIdAndUpdate(id, { $set: { servicename, category, discount } })
        if(!serviceByid  ){

            throw new Error('Service  introuvable');
        }
        updated = await serviceModel.findById(id)
         

        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.deleteServiceByid = async (req, res) => {
    try {
        const { id } = req.params
        serviceByid= await serviceModel.findByIdAndDelete(id)
        
        if(!serviceByid  ){

            throw new Error('service introuvable');
        }
        res.status(200).json("service deleted ");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.affectService= async (req, res) => {
    try {
        const { cityId, serviceId } = req.body;

        
        const serviceByid = await serviceModel.findById(serviceId);
        
        if(!serviceByid){

            throw new Error('service introuvable');
        }

        const cityByid= await cityModel.findById(cityId);

        if(!cityByid  ){

            throw new Error('ville introuvable');
        }

        await serviceModel.findByIdAndUpdate(serviceByid, {
            $set: { city : cityId },
          });
      
          await cityModel.findByIdAndUpdate(cityId, {
            $addToSet: { services: serviceId }
        });

        res.status(200).json(" affected ");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const mongoose = require('mongoose');


module.exports.desaffect = async (req, res) => {
    try {
        const { cityId, serviceId } = req.body;

        const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
        const cityObjectId = new mongoose.Types.ObjectId(cityId);

        const serviceByid = await serviceModel.findById(serviceObjectId);
        if (!serviceByid) {
            throw new Error('Service introuvable');
        }

        const cityByid = await cityModel.findById(cityObjectId);
        if (!cityByid) {
            throw new Error('Ville introuvable');
        }

        const updatedCity = await cityModel.findByIdAndUpdate(
            cityObjectId,
            {
                $pull: { services: serviceObjectId } 
            },
            { new: true } 
        );

        if (!updatedCity) {
            throw new Error('Erreur lors de la mise à jour de la ville');
        }

        const updatedService = await serviceModel.findByIdAndUpdate(
            serviceObjectId,
            {
                $unset: { city: 1 } // Supprimer le champ "city"
            },
            { new: true } // Retourne l'objet mis à jour
        );

        if (!updatedService) {
            throw new Error('Erreur lors de la mise à jour du service');
        }

        res.status(200).json("Service désaffecté avec succès");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const cityModel = require('../models/cityShema')
const activityModel =require('../models/activitySchema')
module.exports.addCity = async (req, res) => {
    try{
        const {nom,description  }=req.body;
        const images = req.files.map(file => file.filename);
        const city = await cityModel.create({
            nom,
            description,
            images,
            
        });
       
        
        res.status(200).json({city});
} catch(error) {
    res.status(500).json({message : error.message});
}
}
module.exports.getllCities = async (req, res) => {
    try{
      
        const cities = await cityModel.find() 
        
        res.status(200).json({cities});
} catch(error) {
    res.status(500).json({message : error.message});
}

}
module.exports.getActivitiesByCity = async (req, res) => {
    try {
        const { cityId } = req.params;

      

        // Vérifier si la ville existe
        const cityExists = await cityModel.exists({ _id: cityId });
        if (!cityExists) {
            return res.status(404).json({ message: 'Ville non trouvée' });
        }

        // Récupération des activités
        const activities = await activityModel.find(
            { city: cityId },
            {
                title: 1,
                location: 1,
                description: 1,
                date: 1,
                price: 1,
                inclus: 1,
                Point_Forts: 1,
                lieu_de_rendez_vous:1,
                favoris:1,
                avis: 1,
                typeActivitiy: 1,
                mainimage: 1,
                images: 1,
                _id: 1
            }
        ).lean();

        // Réponse formatée avec titre
        res.status(200).json({
            success: true,
            message: "Activités récupérées avec succès",
            data: {
                activities: activities
            }
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur',
            error: error.message 
        });
    }


};
module.exports.getCityById = async (req, res) => {
    try {
        const { id } = req.params;

        const city = await cityModel.findById(id).lean();

        if (!city) {
            return res.status(404).json({
                success: false,
                message: "Ville non trouvée"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ville récupérée avec succès",
            data: city
        });

    } catch (error) {
        console.error('Erreur getCityById:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};


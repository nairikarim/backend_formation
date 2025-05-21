const activityModel = require('../models/activitySchema')
const cityModel = require('../models/cityShema')
const User = require('../models/userSchema')

 
module.exports.addActivity = async (req, res) => {
    try {
        // Récupération des données du body (inchangé)
        const { title, location, description, date, price, typeActivitiy, cityname, inclus, Point_Forts, lieu_de_rendez_vous,createdBy } = req.body;

        // 1. Vérification de la ville (inchangé)
        const existingCity = await cityModel.findOne({ nom: cityname });
        if (!existingCity) {
            return res.status(404).json({ message: "Ville non trouvée" });
        }

        // 2. Gestion des fichiers (inchangé)
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Aucune image uploadée" });
        }
        const images = req.files.map(file => file.filename);
        const mainimage = req.files[0].filename;

        // 3. Création de l'activité (inchangé)
        const newActivity = await activityModel.create({
            title,
            location,
            description,
            inclus,
            Point_Forts,
            lieu_de_rendez_vous,
            date,
            price,
            typeActivitiy,
            mainimage,
            images,
            createdBy,
            city: existingCity._id,
        });

        // 4. Mise à jour de la ville (inchangé)
        existingCity.activities.push(newActivity._id);
        await existingCity.save();

        // 5. Réponse (inchangée fonctionnellement mais mieux formatée)
        res.status(201).json({ 
            success: true,
            activity: {
                id: newActivity._id,
                title: newActivity.title,
                location: newActivity.location,
                date:date,
                description:description,
                inclus:inclus,
                Point_Forts:Point_Forts,
                lieu_de_rendez_vous:lieu_de_rendez_vous,
                mainImage: mainimage,
                price:price,
                images: images,
                city: cityname,

            },
            cityUpdated: {
                id: existingCity._id,
                name: existingCity.nom
            }
        });

    } catch (error) {
        // Gestion d'erreur améliorée mais compatible
        console.error("Erreur:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Erreur de validation",
                details: error.errors 
            });
        }
        
        res.status(500).json({ 
            message: "Erreur serveur",
            error: error.message 
        });
    }
};
module.exports.getallActivities = async (req, res) => {
    try {
        const { createdBy, role } = req.query;
        console.log(role,"valid");
        
        if (role =="admin") {
            const activitiesList = await activityModel.find();
            return   res.status(200).json({ activitiesList });
        }
      
  
      if (!createdBy) {
        return res.status(400).json({ message: 'createdBy is required' });
      }
  
      const activitiesList = await activityModel.find({ createdBy });
  
      if (!activitiesList || activitiesList.length === 0) {
        return res.status(404).json({ message: 'No activities found for this user' });
      }
  
      res.status(200).json({ activitiesList });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

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

// Définition de la fonction de recherche asynchrone
module.exports.search = async (req, res) => {
    try {
        // 1. Récupération du terme de recherche depuis l'URL
        // Ex: /api/search?q=Sousse => q = "Sousse"
        const { q } = req.query;

        // 2. Vérification que le terme de recherche existe
        if (!q) {
            return res.status(400).json({ error: "Le paramètre 'q' est requis" });
        }

        // 3. Recherche PARALLÈLE dans les villes et activités
        // Promise.all exécute les 2 requêtes simultanément pour plus de rapidité
        const [villes, activities] = await Promise.all([
            // 3a. Recherche dans les villes (nom similaire au terme)
            cityModel.find({ nom: new RegExp(q, 'i') }) // 'i' = insensible à la casse
                .populate({
                    path: 'activities', // Remplit les activités liées
                    select: 'title location description date  price mainimage images '  // Ne prend que ces champs
                }),
            
            // 3b. Recherche dans les activités (titre ou description)
            activityModel.find({
                $or: [ // Cherche dans l'un OU l'autre champ
                    { title: new RegExp(q, 'i') },
                    { description: new RegExp(q, 'i') }
                ]
            }).populate({
                path: 'city', // Remplit la ville liée
                select: 'nom descrption' // Ne prend que ces champs
            })
        ]);

        // 4. Préparation de la réponse structurée
        const response = {
            villes: [],    // Résultats des villes
            activities: [] // Résultats des activités
        };

        // 5. Gestion des résultats
        if (villes.length > 0) {
            // 5a. Si on a trouvé des villes
            response.villes = villes;
            
            // Récupère toutes les activités de ces villes
            const villeActivities = villes.flatMap(v => v.activities);
            
            // Filtre pour éviter les doublons (activités déjà dans les villes)
            response.activities = activities.filter(a => 
                !villeActivities.some(va => va._id.equals(a._id))
            );
        } else {
            // 5b. Si aucune ville trouvée, prend toutes les activités
            response.activities = activities;
        }

        // 6. Envoi de la réponse au client
        res.json(response);

    } catch (error) {
        // 7. Gestion des erreurs
        console.error("Erreur de recherche:", error);
        res.status(500).json({ 
            error: "Erreur serveur",
            details: error.message // Détails uniquement en développement
        });
    }

 
};



module.exports.deepsearch = async (req, res) => {
    console.log("khdmet");
    
    try {
        // 1. Récupération du terme de recherche depuis l'URL
        // Ex: /api/search?q=Sousse => q = "Sousse"
        console.log( req.body );
        
        const { types, priceMin, priceMax } = req.body;
        const activities = await activityModel.find({
            typeActivitiy: { $in: types },
            price: { $gte: priceMin, $lte: priceMax },
          });

     
       res.status(200).json(activities);
       console.log(activities,"activities");
    } catch (error) {
        // 7. Gestion des erreurs
        console.error("Erreur de recherche:", error);
        res.status(500).json({ 
            error: "Erreur serveur",
            details: error.message // Détails uniquement en développement
        });
    }

 
};


module.exports.getPopularActivities = async (req, res) => {
    try {
        // Get all activities with their reservations, favoris, and avis counts
        const activities = await activityModel.find().lean();

        if (!activities || activities.length === 0) {
            return res.status(404).json({ message: 'Aucune activité trouvée' });
        }

        // Calculate popularity for each activity
        const activitiesWithPopularity = activities.map(activity => {
            // Get counts from the arrays (defensive coding with optional chaining)
            const reservationsCount = activity.reservations?.length || 0;
            const favoritesCount = activity.favoris?.length || 0;
            
            // Calculate average rating from avis
            let averageRating = 0;
            if (activity.avis?.length > 0) {
                const totalRatings = activity.avis.reduce((sum, avi) => {
                    // Handle case where avi might be just an ID or a populated object
                    const rating = typeof avi === 'object' ? (avi.rating || 0) : 0;
                    return sum + rating;
                }, 0);
                averageRating = totalRatings / activity.avis.length;
            }

            // Calculate popularity score (adjust weights as needed)
            const popularityScore = 
                (reservationsCount * 0.5) + 
                (averageRating * 0.3) + 
                (favoritesCount * 0.2);

            return {
                ...activity,
                popularityScore: parseFloat(popularityScore.toFixed(2)),
                reservationsCount,
                averageRating: parseFloat(averageRating.toFixed(1)),
                favoritesCount
            };
        });

        // Sort by popularity (descending)
        activitiesWithPopularity.sort((a, b) => b.popularityScore - a.popularityScore);

        // Get top 5 most popular activities
        const popularActivities = activitiesWithPopularity.slice(0, 5);

        res.status(200).json({
            success: true,
            popularActivities
        });

    } catch (error) {
        console.error('Error in getPopularActivities:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};


module.exports.getecommendedActivities = async (req, res) => {
    try {
        const userId = req.params.userid;
        const City = req.params.city;
        console.log(userId,"sss");

        // 1. Récupérer l'utilisateur avec ses réservations et les activités associées
        const userWithReservations = await User.findById(userId)
            .populate({
                path: 'reservations',
                populate: {
                    path: 'activity',
                    model: 'Activity'
                }
            });

        const city = await cityModel.findOne({ nom: City });

        if (!city) {
            return res.status(404).json({ success: false, message: "City not found" });
        }

        const cityActivities = await activityModel.find({ city: city._id });
        console.log(cityActivities, "city");

        if (!userWithReservations) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        console.log(userWithReservations, "first one");
        // 2. Extraire les types d'activités réservées
        const reservedTypes = userWithReservations.reservations
            .map(res => res.activity?.typeActivitiy);

        console.log(reservedTypes, "aaa");

        // 3. Activités recommandées selon l'historique
        const recommendedActivities = await activityModel.find({
            typeActivite: { $in: reservedTypes }
        });

        // 4. Ajouter 2 activités aléatoires (non déjà incluses)
        const recommendedIds = recommendedActivities.map(a => a._id);

        const randomActivities = await activityModel.aggregate([
            { $match: { _id: { $nin: recommendedIds } } },
            { $sample: { size: 2 } }
        ]);

        // 5. Fusionner et s'assurer que les activités sont uniques
        const allActivities = [...recommendedActivities, ...randomActivities, ...cityActivities];

        // Utiliser un Set pour éliminer les doublons en fonction de l'ID de l'activité
        const uniqueActivitiesMap = new Map();
        allActivities.forEach(activity => {
            uniqueActivitiesMap.set(activity._id.toString(), activity);
        });

        // Récupérer les valeurs (activités uniques) du Map
        const finalActivities = Array.from(uniqueActivitiesMap.values());

        res.status(200).json({
            success: true,
            data: finalActivities
        });

    } catch (error) {
        console.error('Error in getecommendedActivities:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};


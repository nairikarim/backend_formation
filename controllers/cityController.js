const cityModel = require('../models/cityShema')

module.exports.addCity = async (req, res) => {
    try{
        const {cityname,description ,image }=req.body;
        const city = await cityModel.create({
            cityname,
            description,
            image
            
        });
        
        res.status(200).json({city});
} catch(error) {
    res.status(500).json({message : error.message});
}

}
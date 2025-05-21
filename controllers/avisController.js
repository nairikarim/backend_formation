const Activity = require('../models/activitySchema');
const Avis = require('../models/AvisSchema');

module.exports.addAvis = async (req, res) => {
  try {
    const { Texte, Notes, DateAvis, activityId, userId } = req.body;

    // Check if user already reviewed this activity
    const existingReview = await Avis.findOne({ 
      user: userId, 
      activity: activityId 
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this activity',
        existingReview // Optional: return existing review data
      });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const avis = new Avis({
      Texte,
      Notes,
      DateAvis,
      user: userId,
      activity: activityId
    });

    await avis.save();
    activity.avis.push(avis._id);
    await activity.save();

    res.status(200).json({ avis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAvisForActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId).populate({
      path: 'avis',
      populate: { path: 'user', select: 'username email' } // Optional: populate user info
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ avis: activity.avis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

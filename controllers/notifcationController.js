const mongoose = require('mongoose');
const User = require('../models/userSchema');
const Notification = require('../models/notifcationSchema');


module.exports.getUserNotifications = async (req, res) => {
    console.log(req.params.userid);
    
    try {
        const userId = req.params.userid;

        // Find notifications for a specific user
        const notifications = await Notification.find({ user: userId }).sort({ date: -1 });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ success: false, message: "No notifications found" });
        }

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des notifications',
            error: error.message
        });
    }
};


module.exports.createNotification = async (req, res) => {
    try {
        const { title, description, userId } = req.body;

      
        const newNotification = new Notification({
            title,
            description,
            user: userId  
        });

        await newNotification.save();

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: newNotification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création de la notification',
            error: error.message
        });
    }
};



// Delete Notification by ID
module.exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;  // Assuming the notification ID is passed in the URL

        // Find and delete the notification by ID
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
            data: deletedNotification
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression de la notification',
            error: error.message
        });
    }
};

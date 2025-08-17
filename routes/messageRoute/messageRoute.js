const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware.js')

const {  sendMessage,
    getMessages,
    deleteMessage,
    getUnReadedMessagesNumber,
    updateMessageStatus
} = require('../../controllers/messageControllers/messageControllers');

// // Route for sending a message
router.route("/send").post(authMiddleware([1,2,3,4]),sendMessage);
// // Route for getting messages between two police officers
router.route("/getMessages/:senderId/:receiverId").get(authMiddleware([1,2,3,4]),getMessages);
// // Route for deleting a message
router.route("/deleteMessage/:messageId").delete(authMiddleware([1,2,3,4]),deleteMessage);
// Route for getting all messages
router.route("/getUnReadedMessagesNumber/:receiverId/:senderId").get(authMiddleware([1,2,3,4]),getUnReadedMessagesNumber);
 
router.route("/readMessage/:senderId/:receiverId").get(authMiddleware([1,2,3,4]),updateMessageStatus);

module.exports = router;
const express = require('express');
const router = express.Router();


const {     sendMessage,
    getMessages,
    deleteMessage,
    getUnReadedMessagesNumber,
    updateMessageStatus
} = require('../../controllers/messageControllers/messageControllers');

// // Route for sending a message
router.route("/send").post(sendMessage);
// // Route for getting messages between two police officers
router.route("/getMessages/:senderId/:receiverId").get(getMessages);
// // Route for deleting a message
router.route("/deleteMessage/:messageId").delete(deleteMessage);
// Route for getting all messages
router.route("/getUnReadedMessagesNumber/:receiverId/:senderId").get(getUnReadedMessagesNumber);
 
router.route("/readMessage/:senderId/:receiverId").get(updateMessageStatus);

module.exports = router;
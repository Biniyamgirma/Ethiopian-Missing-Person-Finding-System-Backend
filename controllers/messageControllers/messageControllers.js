const db = require("../../database/createDataBase");

const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        // Insert the new message into the database
        const result = db.prepare(`
            INSERT INTO message (sendersId, reciversId, message)
            VALUES (?, ?, ?)
        `).run(senderId, receiverId, message);

        res.status(201).json({ message: "Message sent successfully", messageId: result.lastInsertRowid });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Delete the message from the database
        const result = db.prepare(`
            DELETE FROM message WHERE messageId = ?
        `).run(messageId);

        // Check if the delete was successful
        if (result.changes === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Get messages between two police officers
// Get messages between two police stations
const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    // Prepare the SQL statement first
    const stmt = db.prepare(`
      SELECT 
        m.messageId,
        m.message,
        m.sentAt,
        sender.policeStationId as senderId,
        sender.nameOfPoliceStation as senderName, -- Assuming 'nameOfPoliceStation' is the correct column name as per frontend context
        sender.policeStationLogo as senderLogo,
        receiver.policeStationId as receiverId,
        receiver.nameOfPoliceStation as receiverName, -- Assuming 'nameOfPoliceStation' is the correct column name
        receiver.policeStationLogo as receiverLogo
       FROM message m
       JOIN policeStation sender ON m.sendersId = sender.policeStationId
       JOIN policeStation receiver ON m.reciversId = receiver.policeStationId
       WHERE (m.sendersId = ? AND m.reciversId = ?)
       OR (m.sendersId = ? AND m.reciversId = ?)
       ORDER BY m.sentAt ASC
    `);

    // Execute the prepared statement with parameters
    // .all() is synchronous in better-sqlite3 and returns an array of rows
    const rows = stmt.all(senderId, receiverId, receiverId, senderId);

    // Format the response
    const formattedMessages = rows.map(row => ({
      messageId: row.messageId,
      content: row.message,
      sentAt: row.sentAt,
      senderStation: {
        id: row.senderId,
        name: row.senderName,
        logo: row.senderLogo
      },
      receiverStation: {
        id: row.receiverId,
        name: row.receiverName,
        logo: row.receiverLogo
      }
    }));
    
    res.json({
      success: true,
      data: formattedMessages,
      count: formattedMessages.length
    });

  } catch (error) {
    console.error('Error in getMessages:', error); // Updated console log for better context
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve messages', // Kept generic error for client
      details: error.message // Detailed error for server logs/debugging
        }
    );
  }
};
const updateMessageStatus = async (req, res) => {
  const {senderId, receiverId} = req.params;
    try {
        // Update the message status in the database
        const result = db.prepare(`
            UPDATE message 
            SET isRead = ? 
            WHERE reciversId = ? AND sendersId = ? AND isRead = 0;

        `).run(1, receiverId, senderId);
        res.status(200).json({ message: "Message status updated successfully" });

        // // Check if the update was successful
        // if (result.changes === 0) {
        //     throw new Error("Message not found or already updated");
        //     return res.status(404).json({ message: "Message not found or already updated" });
        // }
    } catch (error) {
        console.error("Error updating message status:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}
const getUnReadedMessagesNumber = async (req, res) => {
    const { receiverId, senderId } = req.params;

    if (!receiverId || !senderId) {
        return res.status(400).json({
            success: false,
            error: 'Receiver ID and Sender ID are required parameters.'
        });
    }

    try {
        // Prepare the SQL statement first
        const stmt = db.prepare(`
            SELECT COUNT(*) as unreadCount
            FROM message
            WHERE reciversId = ? AND sendersId = ? AND isRead = 0
        `);

        // Execute the prepared statement with parameters
        const row = stmt.get(receiverId, senderId);

        res.json({
            success: true,
            // Ensure unreadCount is 0 if no rows are found or row is undefined
            unreadCount: row ? row.unreadCount : 0
        });
    } catch (error) {
        console.error('Error in getUnReadedMessagesNumber:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve unread messages count',
            details: error.message 
        });
    }
}
module.exports = {
    sendMessage,
    deleteMessage,
    getMessages,
    getUnReadedMessagesNumber,
    updateMessageStatus
}
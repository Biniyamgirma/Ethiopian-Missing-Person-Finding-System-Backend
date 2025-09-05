const db = require("../database/createDataBase.js");

const sendDailyRequests = async () => {
    try {
        // fetch users 
        const users = await db.sql(`SELECT * FROM policeOfficer LIMIT 10`);
        users = users || []; 
    }catch (error) {
        console.error("Error sending daily requests:", error);
    }
}

module.exports = sendDailyRequests;
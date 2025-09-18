const db = require("../database/createDataBase.js");

const sendDailyRequests = async () => {
    try {
        // fetch users 
    const data = await db.sql(`SELECT * FROM region LIMIT 10`);
    console.log("Daily request sent. Fetched data:", data);
    }catch (error) {
        console.error("Error sending daily requests:", error);
    }
}

module.exports = sendDailyRequests;
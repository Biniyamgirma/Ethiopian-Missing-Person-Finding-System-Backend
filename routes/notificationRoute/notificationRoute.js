const express = require('express');
const router = express.Router();
const db = require('../../database/createDataBase');

router.route("/numberOfUnReadMessages").post(async(req, res) => {
    const { policeStationId } = req.body;
    try {
const stmt =await db.sql(`SELECT COUNT(*) as count FROM alert WHERE postPoliceStationId = '${policeStationId}' AND isRead = 0`);
const result =await stmt;
const rowCount = result.count;
res.json({ rowCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    

    });
module.exports = router;
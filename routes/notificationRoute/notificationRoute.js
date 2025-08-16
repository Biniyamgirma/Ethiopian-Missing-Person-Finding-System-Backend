const express = require('express');
const router = express.Router();
const db = require('../../database/createDataBase');

router.route("/numberOfUnReadMessages").post((req, res) => {
    const { policeStationId } = req.body;
    try {
        const countQuery = `SELECT COUNT(*) as count FROM alert WHERE postPoliceStationId = ? AND isRead = 0`;
const stmt = db.prepare(countQuery);
const result = stmt.get(policeStationId);
const rowCount = result.count;
res.json({ rowCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    

    });
module.exports = router;
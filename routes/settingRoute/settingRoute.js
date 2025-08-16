const express = require('express');
const router = express.Router();
const { hashPassword,comparePassword } = require('../../utils/jwtUtils');
const db = require('../../database/createDataBase'); // Assuming you have a dbConnection file
const { updatePassword, displayPoliceOfficerInfo,displayPoliceStationInfo } = require('../../controllers/settingController/settingController');

router.route("/updatePassword").post( async(req, res) => {
    console.log("update password route hit");
    try {
        const { policeOfficerId, newPassword, oldPassword } = req.body;

        // Input validation
        if (!policeOfficerId || !newPassword || !oldPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if new password is different from old password
        if (newPassword === oldPassword) {
            return res.status(400).json({ message: "New password must be different from old password" });
        }

        const hashedPassword = await hashPassword(newPassword); 
        
        // Check if the old password matches
        const checkQuery = `SELECT passwordText FROM policeOfficer WHERE policeOfficerId = ?`;
        const checkStmt = db.prepare(checkQuery);
        try {
            const user = checkStmt.get(policeOfficerId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isMatch = await comparePassword(oldPassword, user.passwordText);
            if (!isMatch) {
                return res.status(401).json({ message: "Old password is incorrect" });
            }
        } finally {
            console.log("finalizing check statement");
        }

        // Update the password
        const updateQuery = `UPDATE policeOfficer SET passwordText = ? WHERE policeOfficerId = ?`;
        const updateStmt = db.prepare(updateQuery);
        try {
            const result = updateStmt.run(hashedPassword, policeOfficerId);

            if (result.changes > 0) {
                res.status(200).json({ message: "Password updated successfully" });
            } else {
                res.status(500).json({ message: "Failed to update password. Please try again." });
            }
        } finally {
            console.log("finalizing update statement");
            
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.route("/display-info/:policeOfficerId").get(displayPoliceOfficerInfo);
router.route("/display-station-Info/:policeStationId").get(displayPoliceStationInfo); // For admin to display all police officers' info

module.exports = router;
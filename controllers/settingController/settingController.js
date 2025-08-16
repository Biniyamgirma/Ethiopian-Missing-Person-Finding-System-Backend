const db=require("../../database/createDataBase.js");
const { hashPassword,comparePassword } = require('../../utils/jwtUtils');

const updatePassword =  (req, res) => {
    console.log("Update Password Request Received");
    console.log(req.body);
    // try {
    //     const { policeOfficerId, newPassword, oldPassword } = req.body;

    //     // Input validation
    //     if (!policeOfficerId || !newPassword || !oldPassword) {
    //         return res.status(400).json({ message: "Missing required fields" });
    //     }

    //     // Check if new password is different from old password
    //     if (newPassword === oldPassword) {
    //         return res.status(400).json({ message: "New password must be different from old password" });
    //     }

    //     const hashedPassword = await hashPassword(newPassword); 
        
    //     // Check if the old password matches
    //     const checkQuery = `SELECT passwordText FROM policeOfficer WHERE policeOfficerId = ?`;
    //     const checkStmt = db.prepare(checkQuery);
    //     try {
    //         const user = checkStmt.get(policeOfficerId);
    //         if (!user) {
    //             checkStmt.finalize();
    //             return res.status(404).json({ message: "User not found" });
    //         }

    //         const isMatch = await comparePassword(oldPassword, user.passwordText);
    //         if (!isMatch) {
    //             checkStmt.finalize();
    //             return res.status(401).json({ message: "Old password is incorrect" });
    //         }
    //     } finally {
    //         checkStmt.finalize();
    //     }

    //     // Update the password
    //     const updateQuery = `UPDATE policeOfficer SET passwordText = ? WHERE policeOfficerId = ?`;
    //     const updateStmt = db.prepare(updateQuery);
    //     try {
    //         const result = updateStmt.run(hashedPassword, policeOfficerId);

    //         if (result.changes > 0) {
    //             res.status(200).json({ message: "Password updated successfully" });
    //         } else {
    //             res.status(500).json({ message: "Failed to update password. Please try again." });
    //         }
    //     } finally {
    //         updateStmt.finalize();
    //     }
    // } catch (error) {
    //     console.error("Error updating password:", error);
    //     res.status(500).json({ message: "Internal server error" });
    // }
};
const displayPoliceOfficerInfo = async (req, res) => {
    try {
        const { policeOfficerId } = req.params;
        const query = `SELECT 
    po.policeOfficerId, 
    po.policeOfficerFname, 
    po.policeOfficerMname, 
    po.policeOfficerLname, 
    po.policeOfficerRoleName, 
    po.policeOfficerStatus, 
    po.policeOfficerPhoneNumber, 
    po.policeOfficerGender, 
    po.policeOfficerBirthdate,
    po.policeStationId,
    ps.nameOfPoliceStation,
    ps.policeStationPhoneNumber,
    ps.secPoliceStationPhoneNumber,
    ps.policeStationLogo
FROM 
    policeOfficer po
JOIN 
    policeStation ps ON po.policeStationId = ps.policeStationId
WHERE 
    po.policeOfficerId = ?`;
        const stmt = db.prepare(query);
        const officer = stmt.get(policeOfficerId);
        if (!officer) {
            return res.status(404).json({ message: "Police officer not found" });
        
        }
        res.status(200).json(officer);
    }
    catch (error) {
        console.error("Error fetching police officer info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const displayPoliceStationInfo = (req,res)=>{
    const {policeStationId} = req.params;
    try{
        const sql = `SELECT * FROM policeStation WHERE policeStationId = ?`;
        const stm = db.prepare(sql);
        const data = stm.get(policeStationId);
        if(!data){
            return res.status(404).json({ message: "Police Station Not Found" });
        }
        res.status(200).json({data:data})

    }catch(error){
         res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { updatePassword,displayPoliceOfficerInfo,displayPoliceStationInfo };    
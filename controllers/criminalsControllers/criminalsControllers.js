const db=require("../../database/createDataBase");

const updateCriminal = (req, res) => {
    const { criminalId } = req.params;
    const { photo,
         firstName,
         middleName,
         lastName,
         faceColor,
         hairColor,
         height,
         bodyType,
         age,
         gender,
         fileNumber,
         policeStationId } = req.body;
    try {
        const sql = `UPDATE criminal SET photo=?,
        firstName=?,
        middleName=?,
        lastName=?,
        faceColor=?,
        hairColor=?,
        height=?,
        bodyType=?,
        age=?,
        gender=?,
        fileNumber=?,
        policeStationId=? WHERE criminalId=?`;
        const params = [photo,
            firstName,
            middleName,
            lastName,
            faceColor,
            hairColor,
            height,
            bodyType,
            age,
            gender,
            fileNumber,
            policeStationId,
            criminalId];
        db.prepare(sql).run(params);
        res.status(200).json({
            message: "Criminal updated successfully",
            criminalId,
            photo,
            firstName,
            middleName,
            lastName,
            faceColor,
            hairColor,
            height,
            bodyType,
            age,
            gender,
            fileNumber,
            policeStationId
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating criminal",
            error: error.message
        });
    }
};
const getAllCriminals = (req, res) => {
    try {
        const sql = `SELECT * FROM criminal`;
        const criminals = db.prepare(sql).all();    
        res.status(200).json({
            message: "Criminals retrieved successfully",
            criminals
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving criminals",
            error: error.message
        });
    }
};
const addCriminal = (req, res) => {
    // Safely extract fields from req.body and photo file name from req.file if present
    const {
        firstName,
        middleName,
        lastName,
        faceColor,
        hairColor,
        height,
        bodyType,
        age,
        gender,
        fileNumber,
        policeStationId
    } = req.body;

    // If using multer, req.file will contain the uploaded file info
    const photoFileName = req.file ? req.file.filename : null;

    try {
        const sql = `INSERT INTO criminal (
            photo,
            firstName,
            middleName,
            lastName,
            faceColor,
            hairColor,
            height,
            bodyType,
            age,
            gender,
            fileNumber,
            policeStationId
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
        const params = [
            photoFileName,
            firstName,
            middleName,
            lastName,
            faceColor,
            hairColor,
            height,
            bodyType,
            age,
            gender,
            fileNumber,
            policeStationId
        ];
        db.prepare(sql).run(params);
        res.status(200).json({
            message: "Criminal added successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error adding criminal",
            error: error.message
        });
    }
}
const deleteCriminal = (req, res) => {
    const { criminalId } = req.params;
    try {
        const sql = `DELETE FROM criminal WHERE criminalId=?`;
        db.prepare(sql).run(criminalId);
        res.status(200).json({
            message: "Criminal deleted successfully",
            criminalId
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting criminal",
            error: error.message
        });
    }
};

module.exports = {
    updateCriminal,
    getAllCriminals,
    addCriminal,
    deleteCriminal
};
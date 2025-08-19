const db=require("../../database/createDataBase");
async function insertCriminal(sql,params) {

  await db.sql(sql, ...params);
}
const updateCriminal = async(req, res) => {
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
      await  db.sql`
        UPDATE criminal SET photo=${photo},
        firstName= ${firstName},
        middleName=${middleName},
        lastName=${lastName},
        faceColor=${faceColor},
        hairColor=${hairColor},
        height=${height},
        bodyType=${bodyType},
        age=${age},
        gender=${gender},
        fileNumber=${fileNumber},
        policeStationId=${policeStationId} WHERE criminalId=${criminalId}
        `
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
const getAllCriminals = async(req, res) => {
    try {
        const criminals =await db.sql(`SELECT * FROM criminal`);    
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
const addCriminal = async(req, res) => {
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
        
      await db.sql(`
            INSERT INTO criminal (
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
        ) VALUES (${photoFileName},${firstName},${middleName},${lastName},${faceColor},${hairColor},${height},${bodyType},${age},${gender},${fileNumber},${policeStationId})
            `)

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
const deleteCriminal = async(req, res) => {
    const { criminalId } = req.params;
    try {
        db.sql`DELETE FROM criminal WHERE criminalId=${criminalId}`;
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
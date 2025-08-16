const db=require("../../database/createDataBase");


const getAllRegion = async(req, res) => {
    try {
        
        let regions = await db.sql`SELECT * FROM region`;
        res.status(200).json({
            message: "data fetched successfully",
            regions
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching regions",
            error: error.message
        });
    }
};

const getSpecificZone = async(req, res) => {
    const { regionId } = req.params;
    try {
        const zones = await db.sql`SELECT * FROM zone WHERE regionId=${regionId}`;
        res.status(200).json({
            message: "data fetched successfully",
            zones
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching zones",
            error: error.message
        });
    }
};
const getSpecificTown = async(req, res) => {
    const { zoneId } = req.params;
    try {
        
        const towns =await db.sql`SELECT * FROM town WHERE zoneId = ${zoneId}`;
        res.status(200).json({
            message: "data fetched successfully",
            towns
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching zones",
            error: error.message
        });
    }
};
const getSpecificTownInfo = async(req, res) => {
    const { townId } = req.params;
    try {
        
        const town =await db.sql`SELECT * FROM town WHERE townId = ${townId}`;
        res.status(200).json({
            message: "data fetched successfully",
            town
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching zones",
            error: error.message
        });
    }
};
module.exports = {
    getAllRegion,
    getSpecificZone,
    getSpecificTownInfo,
    getSpecificTown

};
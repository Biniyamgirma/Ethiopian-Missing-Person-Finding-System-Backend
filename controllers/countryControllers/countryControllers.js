const db=require("../../database/createDataBase");


const getAllRegion = (req, res) => {
    try {
        const sql = `SELECT * FROM region`;
        const regions = db.prepare(sql).all();
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

const getSpecificZone = (req, res) => {
    const { regionId } = req.params;
    try {
        const sql = `SELECT * FROM zone WHERE regionId = ?`;
        const zones = db.prepare(sql).all(regionId);
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
const getSpecificTown = (req, res) => {
    const { zoneId } = req.params;
    try {
        const sql = `SELECT * FROM town WHERE zoneId = ?`;
        const towns = db.prepare(sql).all(zoneId);
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
const getSpecificTownInfo = (req, res) => {
    const { townId } = req.params;
    try {
        const sql = `SELECT * FROM town WHERE townId = ?`;
        const town = db.prepare(sql).all(townId);
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
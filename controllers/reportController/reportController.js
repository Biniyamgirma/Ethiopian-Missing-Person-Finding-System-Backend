const db = require("../../database/createDataBase");

const addReport = async (req, res) => {
    try {
        const userId = 1;
        const { postId,townId,subCityId,reportDescription,PoliceStationId,priority } = req.body;

        // Insert the new report into the database
        const result =  db.prepare(`
            INSERT INTO report (postId, townId,subCityId,reportDescription,userId,PoliceStationId)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(postId, townId, subCityId, reportDescription,userId, PoliceStationId);
        // Check if the insert was successful
        if (result.changes === 0) {
            return res.status(400).json({ message: "Failed to create report" });
        }
        // Fetch the newly created report
        const postPoliceStationId =await db.prepare(`
            SELECT policeStationId FROM post WHERE postId = ?
        `).get(postId);
        const id =  postPoliceStationId.policeStationId;
        console.log(id);
        const sql = `
            INSERT INTO alert (postId,localPoliceStationId,postPoliceStationId,isRead,priority,reportId)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const alertResult =db.prepare(sql).run(postId, PoliceStationId, id, 0, priority, result.lastInsertRowid);
        // Check if the alert insert was successful
        if (alertResult.changes === 0) {
            return res.status(400).json({ message: "Failed to create alert" });
        }
        res.status(201).json({ message: "Report created successfully" });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getAllReportsSpecificToPost = async (req, res) => {
    try {
        const { postId } = req.body;
        // Fetch all reports from the database
        const reports = db.prepare(`
            SELECT * FROM report WHERE postId = ?
        `).all(postId);

        res.status(200).json({ reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getReportsSpecificToPoliceStation = async (req, res) => {
    try {
        const { policeStationId } = req.body;
        // Fetch all reports from the database
        const reports = db.prepare(`
          SELECT 
    alert.*,
    report.*,
    post.*,
    policeStation.*
FROM alert
INNER JOIN report ON alert.reportId = report.reportId
INNER JOIN post ON report.postId = post.postId
INNER JOIN policeStation ON alert.localPoliceStationId = policeStation.policeStationId
WHERE alert.postPoliceStationId = ?
        `).all(policeStationId);
        res.status(200).json({count:reports.length, reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const updateReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { reportDescription } = req.body;

        // Update the report in the database
        const result = db.prepare(`
            UPDATE report
            SET reportDescription = ?
            WHERE reportId = ?
        `).run(reportDescription, reportId);

        // Check if the update was successful
        if (result.changes === 0) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.status(200).json({ message: "Report updated successfully" });
    } catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const markSingleReportAsRead = async (req, res) => {
    try {
        const { reportId } = req.params;

        // Update the report in the database
        const result = db.prepare(`
            UPDATE alert
            SET isRead = 1
            WHERE reportId = ?
        `).run(reportId);

        // Check if the update was successful
        if (result.changes === 0) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.status(200).json({ message: "Report marked as read successfully" });
    } catch (error) {
        console.error("Error marking report as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const markAllReportsAsRead = async (req, res) => {
    try {
        const { policeStationId } = req.body;

        // Update the report in the database
        const result = db.prepare(`
            UPDATE alert
            SET isRead = 1
            WHERE policeStationId = ?
        `).run(policeStationId);
        // Check if the update was successful
        if (result.changes === 0) {
            return res.status(404).json({ message: "Reports not found" });
        }   
        res.status(200).json({ message: "Reports marked as read successfully" });
    }
    catch (error) {
        console.error("Error marking report as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.body;

        // Delete the report from the database
        const result = db.prepare(`
            DELETE FROM report WHERE reportId = ?
        `).run(reportId);

        // Check if the delete was successful
        if (result.changes === 0) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addReport,
    getAllReportsSpecificToPost,
    updateReport,
    deleteReport,
    getReportsSpecificToPoliceStation,
    markSingleReportAsRead,
    markAllReportsAsRead
}
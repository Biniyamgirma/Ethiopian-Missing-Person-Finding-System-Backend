const db= require("../../database/createDataBase");
const bcrypt = require("bcrypt");

const viewPostsInArea = async (req,res)=> {
    const { townId } = req.body;
  const postInArea = await db.sql(`SELECT * FROM post WHERE townId = ${townId}`);
        if (!postInArea) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(200).json(postInArea);

}
const viewPostDetails =async (req, res) => {
    const { postId } = req.body;
const postDetails =await db.sql(`SELECT * FROM post WHERE id = ${postId}`);
        if (!postDetails) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (postDetails.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(postDetails[0]);
}
const viewUserProfile =async (req, res) => {
    const { userId } = req.body;
const normalUser=await db.sql(`SELECT * FROM normalUser WHERE id = ${userId}`);
        if (!normalUser) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (normalUser.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(normalUser[0]);
}
const reportPost =async (req, res) => {
    const { postId, reportDescription, userId, subCityId,townId,policeStationId } = req.body;

const report=await db.sql(`INSERT INTO report (postId, townId, subCityId, reportDescription, userId, policeStationId) VALUES (${postId}, ${townId}, ${subCityId}, '${reportDescription}', ${userId}, '${policeStationId}'))`);
       
if (!report) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(201).json({ message: "Report submitted successfully" });
}

module.exports = {
    viewPostsInArea,
    viewPostDetails,
    viewUserProfile,
    reportPost
};
const express = require('express');
const router = express.Router();
const db = require("../../database/createDataBase");
const authMiddleware = require('../../middleware/authMiddleware');

router.route("/").get(async (req, res) => {
    try {
        const { townId } = req.query; // Changed from req.body to req.query for GET requests
        
         console.log(townId);
        const town = await db.sql`SELECT * FROM town WHERE townId = ${townId}`;
        
        // The actual data is in result.rows
        res.status(200).json({  town });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.route("/").post(authMiddleware([1,2,3]),(req,res)=>{
    res.status(200).json({message:"hello from root admin route your tooken is valid and you are authenticated and just finised your work"});
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../../database/createDataBase'); 
const authMiddleware = require('../../middleware/authMiddleware.js')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Optional: Limit file size (e.g., 10MB)
  fileFilter: function (req, file, cb) {
    // Optional: Filter file types
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!'); 
    }
  }
}).single('logoFile'); 
const { addPost,
        editPost,
        getAllPosts,
        getSpecificPost,
        getSpecificPoliceStationInfo,
        getAllPoliceOfficerInOurPoliceStation,
        postAlert,
        alertInTheArea,
        sendMessage,
        addSubPoliceStation,
        updatePoliceOfficerInfo,
        registerNewPoliceOfficer,
        viewReportForSpecificPost,
        deletePoliceStation,
        getPoliceStations
    } = require('../../controllers/policeOfficerAdminController/policeOfficerAdminController');



router.route("/register").post(authMiddleware([2,3,4]),registerNewPoliceOfficer);
router.route("/getPoliceStations").post(authMiddleware([1,2,3,4]),getPoliceStations);
// router.route("/alertInTheArea").post(registerNewPoliceOfficer);
router.route("/addPost").post(authMiddleware([1,2,3,4]),addPost);
router.route("/editPost").post(authMiddleware([1,2,3,4]),editPost);
router.route("/viewReport").post(authMiddleware([1,2,3,4]),viewReportForSpecificPost);
router.route("/updatePoliceOfficerInfo").post(authMiddleware([2,3,4]),updatePoliceOfficerInfo);
// Apply multer middleware 'upload' to the POST request for this route
router.route("/addPoliceStation").post(upload,authMiddleware([3,4]), addSubPoliceStation);
router.route("/alert").post(authMiddleware([1,2,3,4]),postAlert);
router.route("/sendMessage").post(authMiddleware([1,2,3,4]),sendMessage);
router.route("/getActivePosts").post(authMiddleware([1,2,3,4]),getAllPosts);
router.route("/getSpecificPost/:postId").get(authMiddleware([1,2,3,4]),getSpecificPost);
router.route("/getSpecificPoliceStationInfo/:id").get(authMiddleware([1,2,3,4]),getSpecificPoliceStationInfo);
router.route("/getAllPoliceOfficerInOurPoliceStation").post(authMiddleware([1,2,3,4]),getAllPoliceOfficerInOurPoliceStation);
router.route("/zonePoliceOfficer/:zoneId").get(authMiddleware([2,3,4]),async(req, res) => {
    const zoneId = req.params.zoneId;

    try {
      const statement =await db.sql(`SELECT po.*
                    FROM policeOfficer po
                    JOIN policeStation ps ON po.policeStationId = ps.policeStationId
                    JOIN town t ON ps.townId = t.townId
                    WHERE t.zoneId = ${zoneId}`);
      const rows =await statement;
      res.json(rows);
    } catch (error) {
        console.error("Error fetching zone police officers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.route("/deletePoliceStation").delete(authMiddleware([4]),deletePoliceStation);

module.exports = router;
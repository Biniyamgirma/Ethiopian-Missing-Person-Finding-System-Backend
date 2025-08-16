const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../../database/createDataBase'); // Adjust the path to your database module
// --- Multer Configuration ---
// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure this path ('uploads/') exists relative to your server's root directory
    // or provide an absolute path.
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename (e.g., fieldname-timestamp.ext)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload middleware
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
      cb('Error: Images Only!'); // Or cb(new Error('Images Only!'));
    }
  }
}).single('logoFile'); // <-- Changed to 'logoFile' to match the key used in formData.append('logoFile', selectedLogoFile) in the frontend

// --- Route Definition --

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


// routh for our homepage
//@http request using get method
router.route("/register").post(registerNewPoliceOfficer);
router.route("/getPoliceStations").post(getPoliceStations);
// router.route("/alertInTheArea").post(registerNewPoliceOfficer);
router.route("/addPost").post(addPost);
router.route("/editPost").post(editPost);
router.route("/viewReport").post(viewReportForSpecificPost);
router.route("/updatePoliceOfficerInfo").post(updatePoliceOfficerInfo);
// Apply multer middleware 'upload' to the POST request for this route
router.route("/addPoliceStation").post(upload, addSubPoliceStation);
router.route("/alert").post(postAlert);
router.route("/sendMessage").post(sendMessage);
router.route("/getActivePosts").post(getAllPosts);
router.route("/getSpecificPost/:postId").get(getSpecificPost);
router.route("/getSpecificPoliceStationInfo/:id").get(getSpecificPoliceStationInfo);
router.route("/getAllPoliceOfficerInOurPoliceStation").post(getAllPoliceOfficerInOurPoliceStation);
router.route("/zonePoliceOfficer/:zoneId").get((req, res) => {
    const zoneId = req.params.zoneId;

    try {
      const sql = `SELECT po.*
                    FROM policeOfficer po
                    JOIN policeStation ps ON po.policeStationId = ps.policeStationId
                    JOIN town t ON ps.townId = t.townId
                    WHERE t.zoneId = ?`;
      const statement = db.prepare(sql);
      const rows = statement.all(zoneId);
      res.json(rows);
    } catch (error) {
        console.error("Error fetching zone police officers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.route("/deletePoliceStation").delete(deletePoliceStation);

module.exports = router;
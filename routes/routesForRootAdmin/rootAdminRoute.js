const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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
}); // <-- Changed to 'logoFile' to match the key used in formData.append('logoFile', selectedLogoFile) in the frontend

// --- Route Definition --
const db = require("../../database/createDataBase");
const authMiddleware = require('../../middleware/authMiddleware');
const rbacMiddleware = require('../../middleware/rbacMiddleware');
const {getAllPoliceStationInfo,
  updatePoliceStationInfo,
  deletePoliceOfficer,
  getAllPoliceOfficer,
  updatePoliceOfficerInfo,
  registerPoliceStation,
  test,
  addRegion,
  addTown,
  addZone, 
  registerPoliceOfficerAdmin,
  getSpecificPoliceStationInfo,
  updateAdminInfo,
  promotUserToAdmin,addSubCity,addRole,
getAllPoliceOfficerInPoliceStation} = require("../../controllers/rootAdminController/rootAdminController");

const {addSubPoliceStation}=require('../../controllers/policeOfficerAdminController/policeOfficerAdminController');
// base url /api/police/root

//post methods
router.post("/register-police-officer",upload.single('profilePicture'), registerPoliceOfficerAdmin);
router.put("/police-officers/:id",upload.single('profilePicture'), updatePoliceOfficerInfo);
router.route("/add-police-station").post(upload.single('logoFile'), addSubPoliceStation);
router.route("/add-admin-user").post(promotUserToAdmin);
//get route

router.route("/get-all-police-officer").get(getAllPoliceOfficer);
router.route("/get-all-police-officer-in-police-station/:id").get(getAllPoliceOfficerInPoliceStation);
router.route("/get-all-police-station").get(getAllPoliceStationInfo)
router.route("/update-police-station-info/:id").get(getSpecificPoliceStationInfo).put(updatePoliceStationInfo);
router.route("/add-root-user").get(test);
router.route("/add-role").get(addRole);
//put route
router.route("/add-region").put(addRegion);
router.route("/add-zone").put(addZone);
router.route("/add-town").put(addTown);
router.route("/add-subcity").put(addSubCity);
// router.put("/police-officers/:id", upload, updatePoliceOfficerInfo); // Corrected: Apply middleware directly
router.route("/update-admin-info/:id").put(updateAdminInfo);
//delete route
router.route("/delete-officer").delete(deletePoliceOfficer);
router.route("/").get((req,res)=>{
  res.status(200).json({message:"hello from root admin route"});
});
// authMiddleware([4,3,2]),
module.exports = router;

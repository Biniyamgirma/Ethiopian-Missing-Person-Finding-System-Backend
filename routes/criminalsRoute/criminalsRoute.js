// Assuming you have a file like this for criminal routes

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
}).single('photo'); // <-- This is crucial: 'photo' must match the key used in formData.append('photo', selectedFile) in the frontend

// --- Route Definition --

const {updateCriminal,
    getAllCriminals,
    addCriminal,
    deleteCriminal} = require("../../controllers/criminalsControllers/criminalsControllers");
router.put("/updateCriminal/:criminalId", updateCriminal); // Assuming updateCriminal might also need multer if it handles file uploads
router.get("/getAllCriminals", getAllCriminals);
router.post("/addCriminal", upload, addCriminal); // Correctly apply 'upload' middleware here
router.delete("/deleteCriminal/:criminalId", deleteCriminal);

module.exports = router;
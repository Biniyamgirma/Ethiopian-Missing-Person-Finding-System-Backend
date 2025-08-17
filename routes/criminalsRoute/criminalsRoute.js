const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../../middleware/authMiddleware.js');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
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

const {updateCriminal,
    getAllCriminals,
    addCriminal,
    deleteCriminal} = require("../../controllers/criminalsControllers/criminalsControllers");
router.put("/updateCriminal/:criminalId",authMiddleware([1,2,3,4]), updateCriminal); // Assuming updateCriminal might also need multer if it handles file uploads
router.get("/getAllCriminals",authMiddleware([1,2,3,4]), getAllCriminals);
router.post("/addCriminal", upload,authMiddleware([1,2,3,4]), addCriminal); // Correctly apply 'upload' middleware here
router.delete("/deleteCriminal/:criminalId",authMiddleware([1,2,3,4]), deleteCriminal);

module.exports = router;
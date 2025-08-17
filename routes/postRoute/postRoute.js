const express = require('express');
const router = express.Router();
const {addPost,
    getAllPostInCity,
    getAllPostInZone,
    getAllPostInRegion,
    addPostToZoneTable,
    addPostToRegionTable,
    deletePost,
    getSpecificPost,
    editPost,
    getPoliceStationPost,
    cheackPostInZone,
    cheackPostInRegion,
    addPostToCountryTable,
    cheackPostInCountry,
    getAllPostInCountry
} = require('../../controllers/post/postController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../../middleware/authMiddleware');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure 'uploads/' directory exists in your backend root
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')); // Create a unique filename
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.', 400), false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.route("/addpost").post(upload.single('image'),authMiddleware([1,2,3,4]), addPost); // 'image' is the field name from frontend
router.route("/city").post(authMiddleware([1,2,3,4]),getAllPostInCity);
router.route("/zone").post(authMiddleware([1,2,3,4]),getAllPostInZone);
router.route("/region").post(authMiddleware([1,2,3,4]),getAllPostInRegion);
router.route("/country").post(authMiddleware([1,2,3,4]),getAllPostInCountry);

router.route("/policeStation/post").post(authMiddleware([1,2,3,4]),getPoliceStationPost);
router.route("/cheackPostInZone/:postId").get(authMiddleware([1,2,3,4]),cheackPostInZone);
router.route("/cheackPostInRegion/:postId").get(authMiddleware([1,2,3,4]),cheackPostInRegion);


router.route("/addPostToZone").post(authMiddleware([1,2,3,4]),addPostToZoneTable);
router.route("/addPostToRegion").post(authMiddleware([1,2,3,4]),addPostToRegionTable);
router.route("/addPostToCountry").post(authMiddleware([1,2,3,4]),addPostToCountryTable); // Assuming this is the same as addPostToRegion

router.route("/getSpecificPost/:postId").get(authMiddleware([1,2,3,4]),getSpecificPost);
router.route("/editPost/:postId").put(authMiddleware([1,2,3,4]),editPost);
router.route("/deletePost/:postId").delete(authMiddleware([1,2,3,4]),deletePost);
router.route("/cheackPostInCountry/:postId").get(authMiddleware([1,2,3,4]),cheackPostInCountry);


module.exports = router;

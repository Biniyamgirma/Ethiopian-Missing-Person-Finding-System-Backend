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

router.route("/addpost").post(upload.single('image'), addPost); // 'image' is the field name from frontend
router.route("/city").post(getAllPostInCity);
router.route("/zone").post(getAllPostInZone);
router.route("/region").post(getAllPostInRegion);
router.route("/country").post(getAllPostInCountry);

router.route("/policeStation/post").post(getPoliceStationPost);
router.route("/cheackPostInZone/:postId").get(cheackPostInZone);
router.route("/cheackPostInRegion/:postId").get(cheackPostInRegion);


router.route("/addPostToZone").post(addPostToZoneTable);
router.route("/addPostToRegion").post(addPostToRegionTable);
router.route("/addPostToCountry").post(addPostToCountryTable); // Assuming this is the same as addPostToRegion

router.route("/getSpecificPost/:postId").get(getSpecificPost);
router.route("/editPost/:postId").put(editPost);
router.route("/deletePost/:postId").delete(deletePost);
router.route("/cheackPostInCountry/:postId").get(cheackPostInCountry);


module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');

const { addReport,
    getAllReportsSpecificToPost,
    updateReport,
    deleteReport,
    getReportsSpecificToPoliceStation,
    markSingleReportAsRead,
    markAllReportsAsRead
} = require('../../controllers/reportController/reportController');

// Route for adding a new report
router.route("/addReport").post(authMiddleware([1,2,3,4]),addReport);
router.route("/getReportsSpecificToPoliceStation").post(authMiddleware([1,2,3,4]),getReportsSpecificToPoliceStation);
router.route("/markSingleReportAsRead/:reportId").put(authMiddleware([1,2,3,4]),markSingleReportAsRead);
router.route("/markAllReportsAsRead ").put(authMiddleware([1,2,3,4]),markAllReportsAsRead);

router.route("/getReports").get(authMiddleware([1,2,3,4]),getAllReportsSpecificToPost);

router.route("/updateReport/:reportId").put(authMiddleware([1,2,3,4]),updateReport);

router.route("/deleteReport/:reportId").delete(authMiddleware([1,2,3,4]),deleteReport);



module.exports = router;
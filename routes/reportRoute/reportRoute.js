const express = require('express');
const router = express.Router();

const { addReport,
    getAllReportsSpecificToPost,
    updateReport,
    deleteReport,
    getReportsSpecificToPoliceStation,
    markSingleReportAsRead,
    markAllReportsAsRead
} = require('../../controllers/reportController/reportController');

// Route for adding a new report
router.route("/addReport").post(addReport);
router.route("/getReportsSpecificToPoliceStation").post(getReportsSpecificToPoliceStation);
router.route("/markSingleReportAsRead/:reportId").put(markSingleReportAsRead);
router.route("/markAllReportsAsRead ").put(markAllReportsAsRead);

router.route("/getReports").get(getAllReportsSpecificToPost);

router.route("/updateReport/:reportId").put(updateReport);

router.route("/deleteReport/:reportId").delete(deleteReport);



module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const {
    getAllRegion,
    getSpecificZone,
    getSpecificTownInfo,
    getSpecificTown
}=require('../../controllers/countryControllers/countryControllers');

router.route("/allRegion").get(authMiddleware([1,2,3,4]),getAllRegion);
router.route("/specificZone/:regionId").get(authMiddleware([1,2,3,4]),getSpecificZone);
router.route("/specificTown/:zoneId").get(authMiddleware([1,2,3,4]),getSpecificTown);
router.route("/specificTownInfo/:townId").get(authMiddleware([1,2,3,4]),getSpecificTownInfo);
module.exports = router;
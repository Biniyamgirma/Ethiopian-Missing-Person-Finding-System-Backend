const express = require('express');
const router = express.Router();

const {
    getAllRegion,
    getSpecificZone,
    getSpecificTownInfo,
    getSpecificTown
}=require('../../controllers/countryControllers/countryControllers');

router.route("/allRegion").get(getAllRegion);
router.route("/specificZone/:regionId").get(getSpecificZone);
router.route("/specificTown/:zoneId").get(getSpecificTown);
router.route("/specificTownInfo/:townId").get(getSpecificTownInfo);

module.exports = router;
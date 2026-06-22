const { saveTrip } = require("../controllers/tripController");
const { getSavedTrips } = require("../controllers/savedTripsController");
const { getTripDetails } = require("../controllers/tripDetailsController");
const authenticateToken = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/", authenticateToken, saveTrip);
router.get("/saved", authenticateToken, getSavedTrips);
router.get("/:tripId", authenticateToken, getTripDetails);

module.exports = router;

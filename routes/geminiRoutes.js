const { generateTravelPlan } = require("../controllers/geminiController");
const router = require("express").Router();
const authenticateToken = require("../middleware/authMiddleware");

router.post("/generate", authenticateToken, generateTravelPlan);

module.exports = router;

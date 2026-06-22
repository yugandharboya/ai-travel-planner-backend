const { registerUser, loginUser } = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
module.exports = router;

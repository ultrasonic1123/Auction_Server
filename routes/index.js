const {
  userSignUp,
  userLogin,
  getHomePage,
} = require("../controllers/userControllers");
const { verifyToken } = require("../middlewares/authorizationMiddleware");
const router = require("express").Router();

router.post("/register", userSignUp);
router.post("/login", userLogin);
router.get("/home-page", verifyToken, getHomePage);

module.exports = router;

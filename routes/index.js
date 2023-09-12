const {
  userSignUp,
  userLogin,
  getHomePage,
  createRoom,
  getRooms,
  getRoomsByCategory,
  updateOwnRoom,
  getUserInformationByPhone,
  getOwnRooms,
  modifyRoom,
  updateStartAt,
  updateRoomStatus,
} = require("../controllers/userControllers");
const { verifyToken } = require("../middlewares/authorizationMiddleware");
const router = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage });
router.post("/register", userSignUp);
router.post("/login", userLogin);
router.get("/home-page", verifyToken, getHomePage);
router.post("/create-new-room", upload.single("image"), createRoom);
router.get("/get-rooms", getRooms);
router.get("/get-rooms-by-category", getRoomsByCategory);
router.post("/update-own-room", updateOwnRoom);
router.get("/get-user-by-phone", getUserInformationByPhone);
router.post("/get-own-rooms", getOwnRooms);
router.post("/update-room", upload.single("image"), modifyRoom);
router.post("/update-start-at", updateStartAt);
router.post("/update-room-status", updateRoomStatus);
module.exports = router;

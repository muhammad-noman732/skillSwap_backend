const express = require("express");
const profileRouter = express.Router();
const {
  postProfile,
  getUserProfile,
  updateProfile,
  updateProfilePic,
} = require("../controllers/profileController");
const { authVerify } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");


// Create profile
profileRouter.post("/", authVerify, postProfile);

// Get a user's profile
profileRouter.get("/:userId", authVerify, getUserProfile);

// Update profile
profileRouter.put("/",authVerify , updateProfile);

// Update profile picture
profileRouter.put("/picture", authVerify , upload.single("profilePic"), updateProfilePic);

module.exports = profileRouter;

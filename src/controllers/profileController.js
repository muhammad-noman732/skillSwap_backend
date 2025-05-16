const Profile = require('../models/ProfileModal')
const { uploadToCLoudinary, deleteFromCloudinary, extractPublicId } = require('../utils/cloudinary');

// 1. Create Profile
const postProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("user id in profile" , userId);
    
    const { bio, skillsToTeach, skillsToLearn, location } = req.body;

    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists",
        status: "error",
      });
    }

    const newProfile = new Profile({
      userId,
      bio,
      location,
      skillsToTeach,
      skillsToLearn,
    });

    await newProfile.save();

    return res.status(201).json({
      message: "Profile created successfully",
      status: "success",
      data: newProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: "error",
      error: error.message,
    });
  }
};


// 2. Get Profile by userId
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await Profile.findOne({ user: userId }).populate("user", "username email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
        status: "error",
      });
    }

    return res.status(200).json({
      message: "Profile retrieved successfully",
      status: "success",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: "error",
      error: error.message,
    });
  }
};

// 3. Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, location, skilltoLearn, skilltoTeach } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { bio, location, skilltoLearn, skilltoTeach } },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        message: "Profile not found",
        status: "error",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      status: "success",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: "error",
      error: error.message,
    });
  }
};

// 4. Update Profile Picture
const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find profile by user
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
        status: "error",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No profile picture file provided",
      });
    }

    // Delete existing image if available
    if (profile.profilePic) {
      try {
        const publicId = extractPublicId(profile.profilePic);
        if (publicId) await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    // Upload new image
    const uploaded = await uploadToCLoudinary(req.file.path);

    if (!uploaded || !uploaded.secure_url) {
      return res.status(500).json({
        status: "error",
        message: "Failed to upload profile picture",
      });
    }

    // Update profile picture field
    profile.profilePic = uploaded.secure_url;
    await profile.save();

    return res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
      data: profile,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error while updating profile picture",
      error: error.message,
    });
  }
};


module.exports = {
  postProfile,
  getUserProfile,
  updateProfile,
  updateProfilePic,
};

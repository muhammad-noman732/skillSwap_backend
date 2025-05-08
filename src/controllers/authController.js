const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModal");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { userName, email, bio, location, password  , confirmPassword } = req.body;

    // Validation
    if (!email || !password || !userName || !confirmPassword) {
      return res.status(400).json({
        message: "userName, email, password and confirmPassword are required",
        status: "error",
      });
    }

    // Check if user already exists 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
        status: "error",
      });
    }

    // match the password and confirm password
    if(password !== confirmPassword){
        return res.status(409).json({
            message: "Password does not match",
            status: "error",
          });
    }
    

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      userName,
      email,
      bio,
      location,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      status: "success",
      data: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Internal server error",
      status: "error",
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: "error",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: "error",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: "error",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie securely
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Login successful",
      status: "success",
      token,
      data: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      status: "error",
      error: error.message,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Internal server error",
      status: "error",
      error: error.message,
    });
  }
};

// Get current user
const getUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "Internal server error",
      status: "error",
      error: error.message,
    });
  }
};

//  change the passaword 
const changePassword = async (req, res) => {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;
  
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Both current and new passwords are required",
          status: "error",
        });
      }
  
      // Fetch user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          status: "error",
        });
      }
  
      // Validate current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: "Invalid current password",
          status: "error",
        });
      }
  
      // Hash new password and save
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
  
      return res.status(200).json({
        message: "Password changed successfully",
        status: "success",
      });
  
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({
        message: "Internal server error",
        status: "error",
        error: error.message,
      });
    }
  };




module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  changePassword
};


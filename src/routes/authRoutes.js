const  express = require("express");
const authRouter = express.Router();

const { registerUser, loginUser, logout, getUser, changePassword } = require("../controllers/authController");
const { authVerify } = require("../middleware/authMiddleware");

authRouter.post("/signup" , registerUser);
authRouter.post("/login" , loginUser);
authRouter.post('/logout' , authVerify , logout);
authRouter.get("/current-user" , authVerify , getUser);
authRouter.post("/changepassord" , authVerify ,changePassword)

module.exports = { authRouter}
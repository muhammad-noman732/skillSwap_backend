const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const passport = require('passport');
const cookieParser = require("cookie-parser");

const connectToDb = require("./src/config/db");
const { googleRouter } = require("./src/routes/authGoogle");
const { authRouter } = require("./src/routes/authRoutes");
require('./src/config/passport'); //  Google strategy

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', //  React app's origin
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(passport.initialize());


// Routes
app.use("/api/auth", authRouter);
app.use('/api/auth' , googleRouter)


// MongoDB Connection;
connectToDb()


// listen
app.listen(
    process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

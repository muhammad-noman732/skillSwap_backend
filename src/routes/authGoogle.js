const express = require('express');
const googleRouter = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");


//  when go in the api/auth/google than passport will activate google. 
googleRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // data need from google
    session: false, //  no session use, only JWT
  }));

//  when google complete login redirect user to this callback
//  process the info from goggle
googleRouter.get('/google/callback', passport.authenticate('google', {
    session: false, 
    failureRedirect: '/login-failure',  // if login fail ho gya to is url pr redirect ho jae ga
  }), 
//   Agar success hua, to req.user ke andar user ka data aa chuka hota ha
  (req, res) => {
    //  generate jwt token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
    
      //   Send JWT in a Cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000,
  });

  res.redirect('/login-success');
    
  })



  module.exports = { googleRouter}

  

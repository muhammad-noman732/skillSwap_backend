const jwt = require('jsonwebtoken');

const authVerify = (req, res, next) => {
  try {
    const token = req.cookies.token; // token from cookis
    console.log('Cookies:', req.cookies);
     console.log('Token:', req.cookies.token);
     console.log('token' , token)

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, not logged in",
        status: "error",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // attach the user info to the request
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authVerify };

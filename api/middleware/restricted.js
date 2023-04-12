const { JWT_SECRET } = require("../../secrets/secretToken");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      res.status(401).json({ message: "token gereklidir" });
    } else {
      jwt.verify(token, JWT_SECRET, (err, decodeToken) => {
        if (err) {
          res.status(401).json({ message: "token geçersizdir" });
        } else {
          req.decodeToken = decodeToken;
          next();
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

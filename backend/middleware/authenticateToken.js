const jwt = require("jsonwebtoken");
const { clearAuthCookie } = require("../utils/authCookie");

function authenticateToken(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
    return next();
  } catch (error) {
    if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") {
      return next(error);
    }

    clearAuthCookie(res);
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again",
    });
  }
}

module.exports = authenticateToken;

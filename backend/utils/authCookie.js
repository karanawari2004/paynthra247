const jwt = require("jsonwebtoken");

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.RENDER === "true";
}

function getAuthCookieOptions() {
  const production = isProduction();

  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/",
  };
}

function setAuthCookie(res, account) {
  const token = jwt.sign(
    {
      sub: account._id.toString(),
      username: account.username,
      role: account.role,
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "8h",
    }
  );

  res.cookie("access_token", token, {
    ...getAuthCookieOptions(),
    maxAge: 8 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie("access_token", getAuthCookieOptions());
}

module.exports = { setAuthCookie, clearAuthCookie };

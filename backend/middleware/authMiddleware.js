
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware bảo vệ route, kiểm tra token
const protect = async (req, res, next) => {
  let token;

  // Lấy token từ header (Authorization)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Lấy token từ cookies (nếu cần)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ token (trừ password)
    req.user = await User.findById(decoded.id).select("-password");

    next(); // Chuyển sang middleware hoặc route handler tiếp theo
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Nếu là admin, tiếp tục
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// Export cả hai middleware
module.exports = { protect, isAdmin };

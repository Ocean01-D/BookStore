const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const connectDB = require("./config/db");  // Import the connectDB function
const multer = require('multer');
const Product = require("./models/Product"); // Import model Product
const cookieParser = require('cookie-parser');
const methodOverride = require("method-override");
const jwt = require("jsonwebtoken");

dotenv.config(); // Load environment variables from .env file

const app = express();

//const adminRoutes = require('./routes/adminRoutes');
//app.use('/admin', adminRoutes);


// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS for cross-origin requests
app.use(express.urlencoded({ extended: true })); // Để xử lý form data
app.use(cookieParser());
app.use(methodOverride("_method")); // Method override

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend"));
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Cấu hình để phục vụ các file tĩnh từ thư mục 'public'
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  });

// Routes
app.use("/api/products", productRoutes); // Routes for product-related actions
app.use("/api/users", userRoutes); // Routes for user-related actions (e.g., register/login)
app.use("/admin", require("./routes/adminRoutes")); // Routes for admin actions

// Middleware lấy thông tin người dùng từ token
app.use((req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
      req.user = decoded; // Lưu thông tin user vào req để sử dụng ở các route
    } catch (err) {
      console.error("Invalid token:", err.message); // Log nếu token không hợp lệ
    }
  }
  next(); // Tiếp tục middleware tiếp theo
});

// Default route
app.get("/", async (req, res) => {
  try {
    const products = await Product.find({}); // Lấy danh sách sản phẩm
    const user = req.user || null; // Lấy thông tin người dùng nếu đã đăng nhập
    res.render("index", { title: "Trang chủ bán sách", Product: products, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server khi tải trang!");
  }
});

// Route xử lý đăng xuất
app.get("/logout", (req, res) => {
  res.clearCookie("token"); // Xóa cookie chứa token
  res.redirect("/"); // Chuyển hướng về trang chủ
});


// Trang admin
app.get("/admin", async (req, res) => {
  try {
    const products = await Product.find({}); // Lấy tất cả sản phẩm từ MongoDB
    res.render("admin", { products }); // Truyền mảng products vào admin.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server khi tải trang admin!");
  }
});

// Chi tiết sản phẩm
app.get("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId); // Tìm sản phẩm theo ID

    if (!product) {
      return res.status(404).send("Sản phẩm không tồn tại!");
    }

    res.render("detail", { product: product }); // Truyền sản phẩm vào file detail.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server khi tải chi tiết sản phẩm!");
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;

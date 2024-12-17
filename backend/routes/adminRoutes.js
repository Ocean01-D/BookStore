const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product'); // Import model Product

// Middleware kiểm tra admin
const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).send('Access denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.isAdmin) return res.status(403).send('Access denied');
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Route giao diện admin
router.get('/', isAdmin, async (req, res) => {
  try {
    const products = await Product.find({}); // Lấy tất cả sản phẩm từ MongoDB
    res.render('admin', { products }); // Truyền mảng products vào admin.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server khi tải trang admin!');
  }
});

module.exports = router;
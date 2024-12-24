const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product'); // Import model Product
const upload = require('../middleware/uploadMiddleware'); // Import middleware upload

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

// Route GET /admin/edit/:id
router.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('edit', { product }); // Render giao diện edit.ejs với dữ liệu sản phẩm
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading product');
  }
});

// Route POST /admin/edit/:id
router.post('/edit/:id', upload.single('image') ,async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const { title, author, price, stock, description, publishDate, publisher } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : undefined; // Nếu có file ảnh mới

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, author, price, stock, description, publishDate, publisher, ...(image && { image }) },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }

    res.redirect('/admin'); // Chuyển hướng về trang admin
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update product');
  }
});

module.exports = router;
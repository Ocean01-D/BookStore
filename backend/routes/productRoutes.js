const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController'); // Import đầy đủ các hàm
const { protect, admin } = require('../middleware/authMiddleware');  // Giả sử bạn có middleware kiểm tra quyền

const router = express.Router();

// Public Routes
router.get("/", getProducts);  // Lấy danh sách sản phẩm
router.get("/:id", getProductById);  // Lấy thông tin sản phẩm theo ID

// Admin Routes
router.post("/", protect, admin, createProduct);  // Admin tạo sản phẩm mới
router.put("/:id", protect, admin, updateProduct);  // Admin cập nhật sản phẩm
router.delete("/:id", protect, admin, deleteProduct);  // Admin xóa sản phẩm

module.exports = router;

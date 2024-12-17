const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts } = require('../controllers/productController'); // Import đầy đủ các hàm
const { protect, isAdmin } = require('../middleware/authMiddleware');  // Giả sử bạn có middleware kiểm tra quyền
const upload = require('../middleware/uploadMiddleware');  // Import middleware upload
const path = require('path');

const router = express.Router();

// Public Routes
router.get("/", getProducts);  // Lấy danh sách sản phẩm
router.get("/:id", getProductById);  // Lấy thông tin sản phẩm theo ID
router.get('/search', searchProducts);   // Lấy danh sách sản phẩm // Lọc sản phẩm theo tên


// Admin Routes //test bỏ quyền admin protect, isAdmin,
router.post("/", upload.single("image"), createProduct);    // Admin tạo sản phẩm mới
router.put("/:id", updateProduct);  // Admin cập nhật sản phẩm
router.delete("/:id", deleteProduct);  // Admin xóa sản phẩm





module.exports = router;

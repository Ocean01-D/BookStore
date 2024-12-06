const express = require('express');
const { getProducts, addProduct } = require('../controllers/productController');
const router = express.Router();

//router.get('/', getProducts);
//router.post('/', addProduct);

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  } = require("../controllers/productController");
  const { protect, admin } = require("../middleware/authMiddleware");
  
  // Public Routes
  router.get("/", getProducts);
  router.get("/:id", getProductById);
  
  // Admin Routes
  router.post("/", protect, admin, createProduct);
  router.put("/:id", protect, admin, updateProduct);
  router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;

const Product = require("../models/Product"); // Assuming a Product model is defined in your project

// @desc Get all products
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get a single product
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Create a new product
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock } = req.body; // Nhận trường 'title'
    const image = req.file ? `/images/${req.file.filename}` : null; // Lấy đường dẫn ảnh từ multer

    // Kiểm tra các trường bắt buộc
    if (!title || !price) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ tiêu đề và giá sản phẩm." });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      title,          // Thêm 'title' vào model
      description,
      price,
      stock,
      image,          // Đường dẫn ảnh
    });

    await newProduct.save();
    res.redirect("/admin"); // Chuyển hướng về trang admin
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Dữ liệu sản phẩm không hợp lệ." });
  }
};



// @desc Update a product
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { title, author, price, stock, description, publishDate, publisher } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : undefined; // Cập nhật ảnh nếu có file mới
    //console.log(req);  // Kiểm tra req.body và req.file
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        price,
        stock,
        description,
        publishDate,
        publisher,
        ...(image && { image }), // Chỉ cập nhật `image` nếu có
      },
      { new: true, runValidators: true } // Trả về document sau khi cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.redirect("/admin"); // Quay lại giao diện admin sau khi cập nhật
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
};


// @desc Delete a product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    res.redirect('/admin'); // Quay lại giao diện admin sau khi xóa
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete product.");
  }
};


// @desc Search products by name or description
// @route GET /api/products/search
const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || ""; // Lấy từ khóa tìm kiếm từ query string
    const regex = new RegExp(query, "i"); // Tìm kiếm không phân biệt hoa thường
    
    // Tìm kiếm sản phẩm theo title hoặc description
    const products = await Product.find({
      $or: [
        { title: regex },       // Tìm trong title
        { description: regex }, // Tìm trong description
      ],
    });

    // Kiểm tra nếu không có sản phẩm nào
    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào." });
    }

    // Trả về danh sách sản phẩm tìm được
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};

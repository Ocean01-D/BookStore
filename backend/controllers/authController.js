const User = require('../models/User.js');
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Tài khoản admin mặc định
const DEFAULT_ADMIN = {
  username: "admin123@gmail.com",
  password: "123456789"
};

// Hàm đăng ký người dùng
const registerUser = async (req, res) => {
  const { name, email, password } = req.body; // Lấy dữ liệu từ body
  console.log("Request body during registration:", req.body); // Log dữ liệu để kiểm tra

  try {
    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }


    /* // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password during registration:", hashedPassword);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    }); */

    // Lưu trực tiếp mật khẩu dạng plain text
    const newUser = new User({
      name,
      email,
      password, // 
    });

    await newUser.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Hàm đăng nhập người dùng
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Request body:", req.body); // Kiểm tra dữ liệu form

  try {
    // Kiểm tra tài khoản admin mặc định
    if (email === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      console.log("Admin login detected.");
      const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true });
      return res.redirect('/admin'); // Chuyển hướng đến trang admin nếu là tài khoản admin mặc định
    }

    // Tìm kiếm tài khoản trong MongoDB
    const user = await User.findOne({ email });
    console.log("User found in database:", user); // Kiểm tra dữ liệu user

    if (!user) {
      console.log("User not found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    /*  // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch); // Kiểm tra mật khẩu
    

    // Log mật khẩu để kiểm tra
    console.log("Plain password input:", password);
    console.log("Hashed password from database:", user.password);

    if (!isMatch) {
      console.log("Invalid password.");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    */
    
    // So sánh mật khẩu dạng plain text
    if (password !== user.password) {
      console.log("Invalid password.");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tạo JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("Token generated:", token);
    res.cookie('token', token, { httpOnly: true }); // Gửi token về client trong cookie
    res.redirect('/');
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};


module.exports = { registerUser, loginUser };
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String },
  publishDate: { type: Date, default: Date.now },
  publisher: { type: String },

});

module.exports = mongoose.model('Product', ProductSchema);

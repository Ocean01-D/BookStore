document.getElementById('addProductForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const form = document.getElementById('addProductForm');
  const formData = new FormData(form); // Tự động lấy tất cả dữ liệu từ form
  const productId = form.dataset.productId; // Kiểm tra xem form đang ở chế độ "chỉnh sửa" hay "thêm mới"

  // Nếu có ID sản phẩm -> Cập nhật sản phẩm
  if (productId) {
    fetch(`http://localhost:3000/api/products/${productId}`, {
      method: "PUT",
      body: formData, // FormData có hỗ trợ gửi file ảnh
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to update product");
        return response.json();
      })
      .then(data => {
        alert("Product updated successfully!");
        resetForm();
        displayProducts();
      })
      .catch(error => {
        console.error("Error:", error.message);
        alert("Error updating product. Please try again.");
      });
  } else { 
    // Thêm sản phẩm mới
    fetch("http://localhost:3000/api/products", {
      method: "POST",
      body: formData,
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to add product");
        return response.json();
      })
      .then(data => {
        alert("Product added successfully!");
        resetForm();
        displayProducts();
      })
      .catch(error => {
        console.error("Error:", error.message);
        alert("Error adding product. Please try again.");
      });
  }
});

// Hàm chỉnh sửa sản phẩm
function editProduct(productId) {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    })
    .then(product => {
      // Populate form data for editing
      document.getElementById('name').value = product.title;
      document.getElementById('description').value = product.description;
      document.getElementById('price').value = product.price;
      document.getElementById('stock').value = product.stock;
      document.getElementById('productAuthor').value = product.author;
      document.getElementById('productPublisher').value = product.publisher;
      document.getElementById('productPublishDate').value = product.publishDate;

      const form = document.getElementById('addProductForm');
      form.dataset.productId = productId; // Đánh dấu trạng thái form
      document.getElementById('submitButton').innerText = "Update Product";
    })
    .catch(error => {
      console.error("Error:", error.message);
      alert("Error loading product. Please try again.");
    });
}

// Hàm xóa sản phẩm
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`http://localhost:3000/api/products/${productId}`, {
      method: "DELETE",
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to delete product");
        return response.json();
      })
      .then(() => {
        alert("Product deleted successfully!");
        displayProducts(); // Gọi lại hàm này để cập nhật giao diện
      })
      .catch(error => {
        console.error("Error:", error.message);
        alert("Error deleting product. Please try again.");
      });
  }
}

// Hàm reset form về trạng thái ban đầu
function resetForm() {
  const form = document.getElementById('addProductForm');
  form.reset();
  delete form.dataset.productId; // Xóa ID để trở về chế độ "thêm sản phẩm"
  document.getElementById('submitButton').innerText = "Add Product";
}

// Hàm hiển thị danh sách sản phẩm
function displayProducts() {
  fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(products => {
      const productContainer = document.getElementById('productList');
      productContainer.innerHTML = ""; // Clear danh sách cũ

      products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <button onclick="editProduct('${product._id}')">Edit</button>
          <button onclick="deleteProduct('${product._id}')">Delete</button>
        `;
        productContainer.appendChild(productElement);
      });
    })
    .catch(error => console.error("Error displaying products:", error));
}

// Load danh sách sản phẩm khi trang được tải
window.onload = displayProducts;

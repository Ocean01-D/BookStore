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

// Hàm chỉnh sửa sản phẩm (sẽ điều hướng tới giao diện edit.ejs)
function editProduct(productId) {
  window.location.href = `/admin/edit/${productId}`; // Chuyển hướng đến trang chỉnh sửa sản phẩm
}

// Hàm xóa sản phẩm
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`/admin/delete/${productId}`, {
      method: "POST",
    })
      .then(() => {
        alert("Product deleted successfully!");
        window.location.href = "/admin"; // Quay lại trang admin
      })
      .catch(error => {
        console.error("Error:", error.message);
        alert("Error deleting product. Please try again.");
      });
  }
}


// Hàm reset form (chỉ dùng để thêm sản phẩm mới)
function resetForm() {
  const form = document.getElementById('addProductForm');
  form.reset();
  document.getElementById('submitButton').innerText = "Add Product";
}

// Load danh sách sản phẩm khi trang được tải
window.onload = () => {
  console.log("Admin dashboard loaded");
};


// Hàm hiển thị danh sách sản phẩm
function displayProducts() {
  fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(products => {
      const productContainer = document.getElementById('productList');
      productContainer.innerHTML = ""; // Clear danh sách cũ

      if (products.length === 0) {
        productContainer.innerHTML = "<p>No products found</p>";  
        return;
      }      

      products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
          <h3>${product.title}</h3>
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
//window.onload = displayProducts;

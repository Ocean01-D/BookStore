document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const bookContainer = document.getElementById("bookContainer");

    // Hàm hiển thị tất cả sách
    function displayAllBooks(products) {
        // Xóa tất cả sách hiện có trong bookContainer
        bookContainer.innerHTML = '';

        if (products.length === 0) {
            bookContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Không có sách nào.</p></div>';
            return;
        }

        // Hiển thị tất cả sách
        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("col-md-3", "mb-4");
            productElement.setAttribute("data-title", product.title.toLowerCase()); // Thêm data-title để tìm kiếm dễ dàng

            productElement.innerHTML = `
                <div class="card h-100 book-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">Tác giả: ${product.author}</p>
                        <p class="card-text">Năm: ${product.publishDate}</p>
                        <p class="card-text">Nhà xuất bản: ${product.publisher}</p>
                        <a href="/product/${product._id}" class="btn btn-primary">Xem chi tiết</a>
                    </div>
                </div>
            `;
            bookContainer.appendChild(productElement);
        });
    }
    
    // Hàm tìm kiếm sách
    function searchProducts(query) {
        // Gửi yêu cầu tìm kiếm đến backend
        fetch(`/api/products/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    displayAllBooks([]); // Nếu không tìm thấy sách nào
                } else {
                    displayAllBooks(data); // Hiển thị sách tìm thấy
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayAllBooks([]); // Hiển thị lỗi nếu có
            });
    }

    // Xử lý sự kiện submit của form tìm kiếm
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const query = searchInput.value.trim().toLowerCase(); // Lấy từ khóa tìm kiếm và chuyển về chữ thường
        if (query) {
            searchProducts(query);  // Tìm kiếm theo từ khóa
        }
    });

    // Tải tất cả sách khi trang được tải
    fetch("/api/products") // Giả sử bạn có endpoint này để lấy tất cả sản phẩm
        .then(response => response.json())
        .then(data => {
            displayAllBooks(data);  // Hiển thị tất cả sách ban đầu
        })
        .catch(error => console.error('Error loading books:', error));
});
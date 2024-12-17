// DOM Elements
const bookContainer = document.getElementById("bookContainer");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const adminForm = document.getElementById("adminBookForm");

// API endpoints
const API_BASE = "http://localhost:3000/api"; // Đổi sang URL thật khi deploy
const BOOKS_API = `${API_BASE}/books`;
const SEARCH_API = `${BOOKS_API}/search`;
const ADD_BOOK_API = `${API_BASE}/add-book`;

// Fetch books (all or filtered)
async function fetchBooks(query = "") {
    try {
        const endpoint = query ? `${SEARCH_API}?q=${encodeURIComponent(query)}` : BOOKS_API;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch books");

        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        bookContainer.innerHTML = `<p class='text-center text-danger'>Không thể tải sách. Vui lòng thử lại sau.</p>`;
    }
}

// Render books
function renderBooks(books) {
    bookContainer.innerHTML = "";

    if (books.length === 0) {
        bookContainer.innerHTML = '<p class="text-center">Không tìm thấy sách nào.</p>';
        return;
    }

    books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = "col-md-3 mb-4";
        bookCard.innerHTML = `
            <div class="card h-100 book-card" data-id="${book.id}">
                <img src="${book.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">Tác giả: ${book.author}</p>
                    <p class="card-text">Năm: ${book.publishDate}</p>
                    <p class="card-text">Nhà xuất bản: ${book.publisher}</p>
                    <a href="/book-details.html?id=${book.id}" class="btn btn-primary">Xem chi tiết</a>
                </div>
            </div>
        `;
        bookContainer.appendChild(bookCard);
    });
}

// Add a new book from admin
async function addBookFromAdmin(formData) {
    try {
        const response = await fetch(ADD_BOOK_API, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Thêm sách thành công!");
            fetchBooks(); // Refresh book list
        } else {
            const error = await response.json();
            console.error("Add book failed:", error.message);
            alert(`Không thể thêm sách: ${error.message}`);
        }
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Có lỗi xảy ra khi thêm sách.");
    }
}

// Event: Search form submit
if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        fetchBooks(query); // Fetch books matching the search query
    });
}

// Event: Admin form submit
if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(adminForm); // Lấy dữ liệu từ form (bao gồm file ảnh)
        addBookFromAdmin(formData);
        adminForm.reset(); // Clear form fields
    });
}

// Initial fetch (load all books)
document.addEventListener("DOMContentLoaded", () => fetchBooks());



//xử lý đăng nhập
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form reload trang
  
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        if (result.redirect) {
          // Nếu có trường redirect, chuyển hướng đến URL tương ứng
          window.location.href = result.redirect;
        } else {
          alert(result.message || "Logged in successfully");
        }
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau!");
    }
  });
  

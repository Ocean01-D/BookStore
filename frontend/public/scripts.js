const bookContainer = document.getElementById("bookContainer");

// API endpoints
const API_ENDPOINT = "/api/books"; // URL for books
const REGISTER_API = "/api/register"; // URL for registration
const LOGIN_API = "/api/login"; // URL for login
const ADD_BOOK_API = "/api/add-book"; // API endpoint for admin to add books

// Fetch books
async function fetchBooks() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error("Failed to fetch books");
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        bookContainer.innerHTML = `<p class="text-center text-danger">Không thể tải sách. Vui lòng thử lại sau.</p>`;
    }
}

// Render books
function renderBooks(books) {
    bookContainer.innerHTML = "";
    if (books.length === 0) {
        bookContainer.innerHTML = '<p class="text-center">Chưa có sách nào.</p>';
        return;
    }
    books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = "col-md-3 mb-4";
        bookCard.innerHTML = `
            <div class="card h-100 book-card" data-id="${book.id}">
                <img src="${book.image}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">Tác giả: ${book.author}</p>
                    <p class="card-text">Năm: ${book.publishDate}</p>
                    <p class="card-text">Nhà xuất bản: ${book.publisher}</p>
                    <a href="book-details.html?id=${book.id}" class="btn btn-primary">Xem chi tiết</a>
                </div>
            </div>
        `;
        bookContainer.appendChild(bookCard);
    });

    // Add click event listeners to book cards
    document.querySelectorAll(".book-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            const bookId = e.currentTarget.getAttribute("data-id");
            // Navigate to the book detail page with the book ID
            window.location.href = `/book-details.html?id=${bookId}`;
        });
    });
}

// Add new book from admin
async function addBookFromAdmin(book) {
    try {
        const response = await fetch(ADD_BOOK_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(book),
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

// Attach listeners for admin book form (if exists)
const adminForm = document.getElementById("adminBookForm");
if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("adminBookTitle").value;
        const author = document.getElementById("adminBookAuthor").value;
        const year = document.getElementById("adminpublishDate").value;
        const publisher = document.getElementById("adminBookPublisher").value;
        const image = document.getElementById("adminBookImage").value;

        const newBook = { title, author, year, publisher, image };
        addBookFromAdmin(newBook);
        adminForm.reset(); // Clear the form
    });
}

// Fetch books on page load
fetchBooks();

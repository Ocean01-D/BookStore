async function fetchProducts() {
    const res = await fetch('http://localhost:5000/api/products');
    const products = await res.json();
    const productContainer = document.getElementById('products');
    products.forEach(product => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.author}</p>
        <p>${product.price} VND</p>
      `;
      productContainer.appendChild(div);
    });
  }
  fetchProducts();
  
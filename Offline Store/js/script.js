// Offline Store JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const store = document.getElementById('store');

    // Sample products data
    const products = [
        { id: 1, name: 'Product 1', price: 10.99, image: 'images/product1.jpg' },
        { id: 2, name: 'Product 2', price: 15.49, image: 'images/product2.jpg' },
        { id: 3, name: 'Product 3', price: 8.99, image: 'images/product3.jpg' },
        // Add more products as needed
    ];

    // Render products
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        store.appendChild(productDiv);
    });
});

// Function to add product to cart (placeholder)
function addToCart(productId) {
    alert(`Added product ${productId} to cart!`);
    // Implement cart functionality here
}
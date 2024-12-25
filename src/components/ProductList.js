// src/components/ProductList.js
import React from 'react';

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>${(product.price / 100).toFixed(2)}</p>
            <button onClick={() => addToCart(product)} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductList;

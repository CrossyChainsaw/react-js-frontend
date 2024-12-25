// src/components/Cart.js
import React from 'react';

const Cart = ({ cart, removeFromCart }) => {
  return (
    <div className="cart">
      {cart.length > 0 && (
        <div>
          <h3>Your Cart</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${(item.price / 100).toFixed(2)}{' '}
                <button onClick={() => removeFromCart(item.id)} className="remove-button">
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>Total: ${(cart.reduce((total, item) => total + item.price, 0) / 100).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Cart;

// src/components/Cart.js
import React from 'react';

const Cart = ({ cart, removeFromCart }) => {
  return (
    <div className="cart">
      {cart.length > 0 ? (
        <div>
          <h3>Your Cart</h3>
          <ul>
            {cart.map((item) => (
              <li key={item._id}>  {/* Use _id here */}
                {item.name} - ${(item.price / 100).toFixed(2)}{' '}
                Quantity: {item.quantity}  {/* Show quantity */}
                <button onClick={() => removeFromCart(item._id)} className="remove-button"> {/* Pass _id here */}
                  Remove One
                </button>
              </li>
            ))}
          </ul>
          <p>Total: ${(cart.reduce((total, item) => total + item.price * item.quantity, 0) / 100).toFixed(2)}</p>
        </div>
      ) : (
        <p>Your cart is empty!</p>
      )}
    </div>
  );
};

export default Cart;

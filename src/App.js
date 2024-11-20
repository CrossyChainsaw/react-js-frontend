import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import Auth0ProviderWithHistory from './auth0Provider'; // Import the Auth0Provider

const App = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: 'Laptop', price: 999.99, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Smartphone', price: 599.99, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Headphones', price: 199.99, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Smart Watch', price: 149.99, image: 'https://via.placeholder.com/150' },
  ];

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-navbar">
          <h1>MALHALLA</h1>
          <div>
            {!isAuthenticated ? (
              <button onClick={() => loginWithRedirect()}>Log in</button>
            ) : (
              <div>
                <p>Welcome, {user.name}!</p>
                <button onClick={() => logout({ returnTo: window.location.origin })}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="App-main">
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)} className="add-to-cart-button">Add to Cart</button>
            </div>
          ))}
        </div>
        <div className="cart">
          {cart.length > 0 && (
            <div>
              <h3>Your Cart</h3>
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.price}{' '}
                    <button onClick={() => removeFromCart(item.id)} className="remove-button">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p>Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function WrappedApp() {
  return (
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  );
}

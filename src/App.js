import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Auth0ProviderWithHistory from './auth0Provider'; // Import the Auth0Provider

const productManagementDomain = process.env.REACT_APP_PRODUCT_MANAGEMENT_DOMAIN

const OrderHistory = () => {
  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      <p>Here is a list of your past orders.</p>
      <p>THIS FUNCTIONALITY IS NOT IMPLEMENTED YET</p>
      {/* Replace with actual order history content */}
    </div>
  );
};

const App = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // State to hold products
  const [loadingProducts, setLoadingProducts] = useState(true); // Loading state for products
  const [error, setError] = useState(null); // State to hold error message

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${productManagementDomain}api/data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors', // Specify the CORS mode
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);  // Assuming you're using state to store products
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message); // Set the error state
        setLoadingProducts(false); // Stop loading even on error
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="App-navbar">
            <div>
              {isAuthenticated && (
                <Link to="/order-history" className="order-history-button">
                  Order History
                </Link>
              )}
            </div>
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
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {loadingProducts ? (
                    <p>Loading products...</p>
                  ) : error ? (
                    <p>Error: {error}</p> // Display error message if there was an issue fetching products
                  ) : (
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
                  )}
                  <div className="cart">
                    {cart.length > 0 && (
                      <div>
                        <h3>Your Cart</h3>
                        <ul>
                          {cart.map((item, index) => (
                            <li key={index}>
                              {item.name} - ${item.price.toFixed(2)}{' '}
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
                </div>
              }
            />
            <Route
              path="/order-history"
              element={isAuthenticated ? <OrderHistory /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default function WrappedApp() {
  return (
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  );
}

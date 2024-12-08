import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Auth0ProviderWithHistory from './auth0Provider'; // Import the Auth0Provider

const productManagementDomain = process.env.REACT_APP_PRODUCT_MANAGEMENT_DOMAIN;

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

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <h2>Privacy Policy</h2>
      <p>
        Welcome to Malhalla's Privacy Policy. We value your privacy and strive to protect your personal
        information. This document outlines how we collect, use, and store your data.
      </p>
      <h3>What Data We Collect</h3>
      <p>
        We collect the following data:
        <ul>
          <li>First and last name</li>
          <li>Email address</li>
          <li>Number of logins</li>
          <li>Time and location of logins</li>
          <li>Browser and device information</li>
        </ul>
      </p>
      <h3>How We Use Your Data</h3>
      <p>
        We use your data to:
        <ul>
          <li>Provide secure access to our platform</li>
          <li>Improve your user experience</li>
          <li>Ensure account security</li>
        </ul>
      </p>
      <h3>How to Exercise Your Rights</h3>
      <p>
        Under GDPR, you have the right to access, modify, or delete your data. To exercise your rights,
        contact us at <a href="mailto:thezombexplorer@gmail.com">thezombexplorer@gmail.com</a>.
      </p>
      <h3>Third-Party Services</h3>
      <p>
        We use Auth0 for authentication. For details on how Auth0 processes your data, please see their{' '}
        <a href="https://auth0.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>.
      </p>
      <p>
        For more information or questions about our Privacy Policy, please contact us at{' '}
        <a href="mailto:thezombexplorer@gmail.com">thezombexplorer@gmail.com</a>.
      </p>
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
              <Link to="/privacy-policy" className="privacy-policy-link">
                Privacy Policy
              </Link>
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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

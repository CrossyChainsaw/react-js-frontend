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
        information. This document outlines how we collect, use, store, and share your data.
      </p>
      
      <h3>What Data We Collect</h3>
      <p>
        We collect the following personal data:
        <ul>
          <li>First and last name</li>
          <li>Email address</li>
          <li>Number of logins</li>
          <li>Time and location of logins</li>
          <li>Browser and device information</li>
          <li>Payment information (if applicable)</li>
          <li>IP address and geolocation (via cookies)</li>
        </ul>
      </p>
      
      <h3>How We Use Your Data</h3>
      <p>
        We use your data to:
        <ul>
          <li>Provide secure access to our platform</li>
          <li>Improve your user experience</li>
          <li>Ensure account security</li>
          <li>Comply with legal obligations</li>
        </ul>
      </p>

      <h3>How Long We Retain Your Data</h3>
      <p>
        We retain your data as long as necessary to provide the services you request or as required by law. 
        For more details, please see Auth0's privacy policy.
      </p>

      <h3>Categories of Personal Data Collected</h3>
      <p>
        We collect the following categories of personal data:
        <ul>
          <li>Contact Information: Name, email address</li>
          <li>Technical Data: Device information, browser details, IP address</li>
          <li>Authentication Data: Logins, time, and location of logins</li>
          <li>Financial Information: Payment details (if applicable)</li>
        </ul>
      </p>

      <h3>Sharing and Selling of Your Data</h3>
      <p>
        We do not sell your personal data. However, we may share your data with third-party providers for specific purposes such as authentication, hosting, and security. These third parties include:
        <ul>
          <li>Auth0: for authentication services (see their <a href="https://auth0.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
          <li>Other service providers: for security, hosting, and platform improvement</li>
        </ul>
      </p>

      <h3>Your Rights</h3>
      <p>
        Under GDPR and other privacy laws, you have the right to:
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request corrections to your personal data</li>
          <li>Request deletion of your personal data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Withdraw your consent for data processing at any time</li>
        </ul>
        To exercise your rights, contact us at <a href="mailto:thezombexplorer@gmail.com">thezombexplorer@gmail.com</a>.
      </p>
      
      <h3>Cookies and Tracking Technologies</h3>
      <p>
        We use cookies and similar tracking technologies to improve your user experience. These technologies may collect data such as your IP address, browser type, and device information. You can manage your cookie preferences through your browser settings or opt-out via a consent banner.
      </p>

      <h3>How to Exercise Your Rights</h3>
      <p>
        If you wish to exercise your rights, such as opting out of data collection or requesting data deletion, please contact us at <a href="mailto:thezombexplorer@gmail.com">thezombexplorer@gmail.com</a>.
        Additionally, you may exercise your rights through a privacy consent management pop-up or banner that appears upon your visit to our platform.
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

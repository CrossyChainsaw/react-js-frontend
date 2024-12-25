// src/App.js
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Auth0ProviderWithHistory from './auth0Provider'; // Import the Auth0Provider
import OrderHistory from './components/OrderHistory';
import PrivacyPolicy from './components/PrivacyPolicy';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Navbar from './components/Navbar';

const productManagementDomain = process.env.REACT_APP_PRODUCT_MANAGEMENT_DOMAIN;

const App = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${productManagementDomain}api/data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

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
          <Navbar isAuthenticated={isAuthenticated} user={user} loginWithRedirect={loginWithRedirect} logout={logout} />
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
                    <p>Error: {error}</p>
                  ) : (
                    <ProductList products={products} addToCart={addToCart} />
                  )}
                  <Cart cart={cart} removeFromCart={removeFromCart} />
                </div>
              }
            />
            <Route path="/order-history" element={isAuthenticated ? <OrderHistory /> : <Navigate to="/" />} />
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

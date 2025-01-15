import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, user, loginWithRedirect, logout }) => {
  return (
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
  );
};

export default Navbar;

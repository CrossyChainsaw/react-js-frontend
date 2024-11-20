// src/Auth0Provider.js
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

// Get Auth0 credentials from environment variables
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

// Auth0Provider component setup
const Auth0ProviderWithHistory = ({ children }) => {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider from './contexts/auth.provider';
import QueryProvider from './components/query-provider';
import ToastContainer from './components/toast';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <QueryProvider>
            <App />
          </QueryProvider>
        </AuthProvider>
        <ToastContainer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);

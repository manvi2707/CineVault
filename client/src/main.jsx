import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MyListProvider } from './context/MyListContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MyListProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#161929',
                color: '#F0EDE8',
                border: '1px solid #2A2F47',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#C8A96E', secondary: '#0D0F1A' },
              },
              error: {
                iconTheme: { primary: '#E05C5C', secondary: '#0D0F1A' },
              },
            }}
          />
        </MyListProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

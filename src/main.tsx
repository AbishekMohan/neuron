import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ProfileProvider } from './context/ProfileContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <ProfileProvider>
            <ProgressProvider>
              <App />
            </ProgressProvider>
          </ProfileProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>,
);

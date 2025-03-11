import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ModalStateProvider } from './context/ModalContext';
import { CostSettingsProvider } from './context/CostSettingsContext';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  const reportWebVitals = async () => {
    const { onCLS, onFID, onLCP } = await import('web-vitals');
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);
  };
  reportWebVitals();
}

// Set the app element for react-modal
Modal.setAppElement('#root');

// Create root with error boundary
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ProjectProvider>
          <CostSettingsProvider>
            <ModalStateProvider>
              <App />
            </ModalStateProvider>
          </CostSettingsProvider>
        </ProjectProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
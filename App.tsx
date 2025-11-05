
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import CustomerChatPage from './pages/CustomerChatPage';
import SupportDashboardPage from './pages/SupportDashboardPage';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/customer-chat" 
          element={
            currentUser?.type === 'customer' ? <CustomerChatPage /> : <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/support-dashboard" 
          element={
            currentUser?.type === 'agent' ? <SupportDashboardPage /> : <Navigate to="/login" replace />
          } 
        />
        
        <Route path="/" element={<LandingPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;

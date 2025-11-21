import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Summary from './components/Dashboard/Summary';
import PayrollDetails from './components/Dashboard/PayrollDetails';
import UserProfile from './components/Dashboard/UserProfile';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import authService from './services/auth.service';
import './App.css';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb', // Blue-600
          colorLink: '#2563eb',
          colorSuccess: '#10b981', // Green-500
          colorWarning: '#f59e0b', // Amber-500
          colorError: '#ef4444', // Red-500
          colorInfo: '#3b82f6', // Blue-500
          colorBgBase: '#ffffff', // White
          colorBgLayout: '#f8fafc', // Slate-50
          colorBgContainer: '#ffffff',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Button: {
            primaryShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
          },
          Card: {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
          Layout: {
            headerBg: '#ffffff',
            bodyBg: '#f8fafc',
          },
        },
      }}
    >
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll-details/:uploadId"
            element={
              <ProtectedRoute>
                <PayrollDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;

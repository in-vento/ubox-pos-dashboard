import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('cloud_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/staff" element={<div className="text-white p-8 text-center">Staff Page (Coming Soon)</div>} />
                  <Route path="/reports" element={<div className="text-white p-8 text-center">Reports Page (Coming Soon)</div>} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
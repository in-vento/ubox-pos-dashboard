import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Cashier from './pages/Cashier';
import Waiters from './pages/Waiters';
import Catalog from './pages/Catalog';
import Plans from './pages/Plans';
import Logs from './pages/Logs';

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
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/cashier" element={<Cashier />} />
                  <Route path="/waiters" element={<Waiters />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/logs" element={<Logs />} />
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
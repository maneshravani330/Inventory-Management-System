import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import AddEditProduct from './pages/Products/AddEditProduct';
import Categories from './pages/Categories/Categories';
import Suppliers from './pages/Suppliers/Suppliers';
import AddEditSupplier from './pages/Suppliers/AddEditSupplier';
import Transactions from './pages/Transactions/Transactions';
import TransactionDetails from './pages/Transactions/TransactionDetails';
import Purchase from './pages/Purchase/Purchase';
import Sell from './pages/Sell/Sell';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/add" element={<AddEditProduct />} />
                      <Route path="/products/edit/:id" element={<AddEditProduct />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/suppliers/add" element={<AddEditSupplier />} />
                      <Route path="/suppliers/edit/:id" element={<AddEditSupplier />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/transactions/:id" element={<TransactionDetails />} />
                      <Route path="/purchase" element={<Purchase />} />
                      <Route path="/sell" element={<Sell />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

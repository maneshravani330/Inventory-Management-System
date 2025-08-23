import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import {
  Inventory,
  Category,
  People,
  SwapHoriz,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import apiService from '../../services/apiService';
import { Product, Category as CategoryType, Supplier, Transaction } from '../../services/apiService';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalTransactions: number;
  lowStockProducts: Product[];
  recentTransactions: Transaction[];
  monthlyTransactions: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    totalTransactions: 0,
    lowStockProducts: [],
    recentTransactions: [],
    monthlyTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, suppliersRes, transactionsRes] = await Promise.all([
        apiService.getAllProducts(),
        apiService.getAllCategories(),
        apiService.getAllSuppliers(),
        apiService.getAllTransactions(),
      ]);

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const monthlyTransactionsRes = await apiService.getTransactionsByMonthYear(currentMonth, currentYear);

      const products = productsRes.data || [];
      const lowStockProducts = products.filter((product: Product) => product.stockQuantity < 10);

      setStats({
        totalProducts: products.length,
        totalCategories: categoriesRes.data?.length || 0,
        totalSuppliers: suppliersRes.data?.length || 0,
        totalTransactions: transactionsRes.data?.length || 0,
        lowStockProducts,
        recentTransactions: (transactionsRes.data || []).slice(0, 5),
        monthlyTransactions: monthlyTransactionsRes.data || [],
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Inventory sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: <Category sx={{ fontSize: 40, color: '#388e3c' }} />,
      color: '#e8f5e8',
    },
    {
      title: 'Suppliers',
      value: stats.totalSuppliers,
      icon: <People sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Transactions',
      value: stats.totalTransactions,
      icon: <SwapHoriz sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      color: '#f3e5f5',
    },
  ];

  const pieData = stats.monthlyTransactions.reduce((acc: any[], transaction: Transaction) => {
    const type = transaction.transactionType;
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {statCards.map((stat, index) => (
          <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' } }}>
            <Card sx={{ backgroundColor: stat.color }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Monthly Transactions Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66% - 8px)' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Transactions
            </Typography>
            {stats.monthlyTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyTransactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No transaction data available for this month
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Transaction Types Pie Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(34% - 8px)' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Types
            </Typography>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No transaction data available
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Low Stock Alert */}
        {stats.lowStockProducts.length > 0 && (
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="error">
                Low Stock Alert
              </Typography>
              {stats.lowStockProducts.map((product) => (
                <Alert severity="warning" sx={{ mb: 1 }} key={product.id}>
                  <Typography variant="body2">
                    <strong>{product.name}</strong> - Only {product.stockQuantity} units left
                  </Typography>
                </Alert>
              ))}
            </Paper>
          </Box>
        )}

        {/* Recent Transactions */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            {stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((transaction) => (
                <Box
                  key={transaction.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}
                >
                  <Box display="flex" alignItems="center">
                    {transaction.transactionType === 'PURCHASE' ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {transaction.description || `Transaction #${transaction.id}`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {transaction.transactionType} - Products: {transaction.totalProducts || 0}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    ₹{transaction.totalPrice?.toFixed(2) || 'N/A'}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No recent transactions
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

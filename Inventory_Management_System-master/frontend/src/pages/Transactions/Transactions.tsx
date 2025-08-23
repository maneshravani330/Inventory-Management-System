import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ShoppingCart as PurchaseIcon,
  Store as SellIcon,
  Undo as ReturnIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService, { Transaction } from '../../services/apiService';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllTransactions(0, 1000, searchText);
      if (response.success) {
        setTransactions(response.data || []);
      } else {
        showSnackbar('Failed to fetch transactions', 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching transactions', 'error');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSearch = () => {
    fetchTransactions();
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return 'success';
      case 'SALE':
        return 'primary';
      case 'RETURN':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return <PurchaseIcon fontSize="small" />;
      case 'SALE':
        return <SellIcon fontSize="small" />;
      case 'RETURN':
        return <ReturnIcon fontSize="small" />;
      default:
        return <AddIcon fontSize="small" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'ALL' || transaction.transactionType === filterType;
    return matchesType;
  });

    const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTransactions}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/purchase')}
          >
            New Transaction
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search transactions..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Transaction Type</InputLabel>
          <Select
            value={filterType}
            label="Transaction Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="ALL">All Types</MenuItem>
            <MenuItem value="PURCHASE">Purchase</MenuItem>
            <MenuItem value="SALE">Sale</MenuItem>
            <MenuItem value="RETURN">Return</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell align="center"><strong>Products</strong></TableCell>
                <TableCell align="center"><strong>Total Price</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {transaction.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getTransactionTypeIcon(transaction.transactionType)}
                        label={transaction.transactionType}
                        color={getTransactionTypeColor(transaction.transactionType) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        color={transaction.transactionType === 'SALE' || transaction.transactionType === 'RETURN' ? 'error.main' : 'success.main'}
                      >
                        {transaction.transactionType === 'SALE' || transaction.transactionType === 'RETURN' ? '-' : '+'}
                        {transaction.totalProducts}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        ₹{transaction.totalPrice?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(transaction.createdAt || '')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        color={transaction.status === 'COMPLETED' ? 'success' : 'warning'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Transaction Summary */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6" color="success.main">
            Total Purchases
          </Typography>
          <Typography variant="h4">
            {filteredTransactions.filter(t => t.transactionType === 'PURCHASE').length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6" color="primary.main">
            Total Sales
          </Typography>
          <Typography variant="h4">
            {filteredTransactions.filter(t => t.transactionType === 'SALE').length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6" color="warning.main">
            Total Returns
          </Typography>
          <Typography variant="h4">
            {filteredTransactions.filter(t => t.transactionType === 'RETURN').length}
          </Typography>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Transactions;

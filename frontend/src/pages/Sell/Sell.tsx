import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Store as SellIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Receipt as ReceiptIcon,
  Person as CustomerIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService, { Product } from '../../services/apiService';

interface SaleItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const Sell: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsRes = await apiService.getAllProducts();

      if (productsRes.success) {
        // Filter products that have stock
        const availableProducts = (productsRes.data || []).filter(product => product.stockQuantity > 0);
        setProducts(availableProducts);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(productId);
      // Set default price to product's price if available
      setUnitPrice(product.price || 0);
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0 || unitPrice <= 0) {
      setError('Please select a product and enter valid quantity and price');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      setError('Selected product not found');
      return;
    }

    // Check if we have enough stock
    const existingItem = saleItems.find(item => item.product.id === selectedProduct);
    const totalRequestedQuantity = quantity + (existingItem?.quantity || 0);
    
    if (totalRequestedQuantity > product.stockQuantity) {
      setError(`Not enough stock. Available: ${product.stockQuantity}, Requested: ${totalRequestedQuantity}`);
      return;
    }

    // Check if product already exists in sale items
    const existingItemIndex = saleItems.findIndex(item => item.product.id === selectedProduct);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...saleItems];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
      setSaleItems(updatedItems);
    } else {
      // Add new item
      const newItem: SaleItem = {
        product,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
      };
      setSaleItems([...saleItems, newItem]);
    }

    // Reset form
    setSelectedProduct('');
    setQuantity(1);
    setUnitPrice(0);
    setError('');
  };

  const handleRemoveItem = (productId: number) => {
    setSaleItems(saleItems.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stockQuantity) {
      setError(`Not enough stock. Available: ${product.stockQuantity}`);
      return;
    }

    const updatedItems = saleItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice,
        };
      }
      return item;
    });
    setSaleItems(updatedItems);
    setError('');
  };

  const handleUpdatePrice = (productId: number, newPrice: number) => {
    if (newPrice < 0) return;

    const updatedItems = saleItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          unitPrice: newPrice,
          totalPrice: item.quantity * newPrice,
        };
      }
      return item;
    });
    setSaleItems(updatedItems);
  };

  const getTotalAmount = () => {
    return saleItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return saleItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getAvailableStock = (productId: number) => {
    const product = products.find(p => p.id === productId);
    const soldQuantity = saleItems.find(item => item.product.id === productId)?.quantity || 0;
    return (product?.stockQuantity || 0) - soldQuantity;
  };

  const handleSubmitSale = async () => {
    if (saleItems.length === 0) {
      setError('Please add at least one item to the sale');
      return;
    }

    if (!customerName.trim()) {
      setError('Please enter customer name');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create sale transactions for each item
      const salePromises = saleItems.map(item =>
        apiService.createSaleTransaction({
          productId: item.product.id,
          quantity: item.quantity,
          description: description || `Sale of ${item.product.name} to ${customerName}`,
        })
      );

      const results = await Promise.all(salePromises);
      
      // Check if all transactions were successful
      const failedTransactions = results.filter(result => !result.success);
      
      if (failedTransactions.length > 0) {
        setError(`Failed to create ${failedTransactions.length} sale transactions`);
      } else {
        setSuccess(`Successfully completed sale of ${saleItems.length} items for ₹${getTotalAmount().toFixed(2)}`);
        // Reset form
        setSaleItems([]);
        setCustomerName('');
        setCustomerEmail('');
        setDescription('');
        
        // Reload products to update stock levels
        loadProducts();
        
        // Redirect to transactions page after a delay
        setTimeout(() => {
          navigate('/transactions');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to complete sale');
      console.error('Sale error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setSaleItems([]);
    setCustomerName('');
    setCustomerEmail('');
    setDescription('');
    setError('');
    setSuccess('');
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <SellIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Point of Sale
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Add Item Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Items to Sale
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={selectedProduct}
                  label="Select Product"
                  onChange={(e) => handleProductSelect(e.target.value as number)}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{product.name}</span>
                        <Chip 
                          label={`Stock: ${product.stockQuantity}`}
                          size="small"
                          color={product.stockQuantity < 10 ? 'error' : 'success'}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                fullWidth
                helperText={selectedProduct ? `Available: ${getAvailableStock(selectedProduct)}` : ''}
              />

              <TextField
                label="Unit Price (₹)"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={!selectedProduct || quantity <= 0 || unitPrice <= 0}
                fullWidth
              >
                Add to Cart
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Sale Summary & Customer Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Sale Summary
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: 'center', pb: '16px !important' }}>
                  <Typography variant="h4" color="primary">
                    {getTotalItems()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Items
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: 'center', pb: '16px !important' }}>
                  <Typography variant="h4" color="success.main">
                    ₹{getTotalAmount().toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <CustomerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Customer Information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Customer Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Customer Email (Optional)"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                fullWidth
              />

              <TextField
                label="Sale Notes (Optional)"
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<MoneyIcon />}
                  onClick={handleSubmitSale}
                  disabled={loading || saleItems.length === 0 || !customerName.trim()}
                  fullWidth
                  size="large"
                >
                  {loading ? <CircularProgress size={24} /> : `Complete Sale - ₹${getTotalAmount().toFixed(2)}`}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearAll}
                  disabled={loading}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Shopping Cart Table */}
        {saleItems.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shopping Cart ({saleItems.length} items)
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell align="center"><strong>Available Stock</strong></TableCell>
                      <TableCell align="center"><strong>Quantity</strong></TableCell>
                      <TableCell align="right"><strong>Unit Price</strong></TableCell>
                      <TableCell align="right"><strong>Total Price</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleItems.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {item.product.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              SKU: {item.product.sku || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getAvailableStock(item.product.id)}
                            color={getAvailableStock(item.product.id) < 5 ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stockQuantity}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdatePrice(item.product.id, parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.01 }}
                            size="small"
                            sx={{ width: 100 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            ₹{item.totalPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Remove Item">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveItem(item.product.id)}
                            >
                              <ClearIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Cart Total */}
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Total ({getTotalItems()} items):
                  </Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    ₹{getTotalAmount().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Sell;

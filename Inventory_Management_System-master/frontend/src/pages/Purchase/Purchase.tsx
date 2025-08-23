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
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as PurchaseIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService, { Product, Supplier } from '../../services/apiService';

interface PurchaseItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const Purchase: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [selectedSupplier, setSelectedSupplier] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsRes, suppliersRes] = await Promise.all([
        apiService.getAllProducts(),
        apiService.getAllSuppliers(),
      ]);

      if (productsRes.success) {
        setProducts(productsRes.data || []);
      }
      if (suppliersRes.success) {
        setSuppliers(suppliersRes.data || []);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
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

    // Check if product already exists in purchase items
    const existingItemIndex = purchaseItems.findIndex(item => item.product.id === selectedProduct);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...purchaseItems];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
      setPurchaseItems(updatedItems);
    } else {
      // Add new item
      const newItem: PurchaseItem = {
        product,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
      };
      setPurchaseItems([...purchaseItems, newItem]);
    }

    // Reset form
    setSelectedProduct('');
    setQuantity(1);
    setUnitPrice(0);
    setError('');
  };

  const handleRemoveItem = (productId: number) => {
    setPurchaseItems(purchaseItems.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const updatedItems = purchaseItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice,
        };
      }
      return item;
    });
    setPurchaseItems(updatedItems);
  };

  const getTotalAmount = () => {
    return purchaseItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return purchaseItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmitPurchase = async () => {
    if (purchaseItems.length === 0) {
      setError('Please add at least one item to the purchase');
      return;
    }

    if (!selectedSupplier) {
      setError('Please select a supplier');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create purchase transactions for each item
      const purchasePromises = purchaseItems.map(item =>
        apiService.createPurchaseTransaction({
          productId: item.product.id,
          quantity: item.quantity,
          supplierId: selectedSupplier as number,
          description: description || `Purchase of ${item.product.name} from supplier`,
        })
      );

      const results = await Promise.all(purchasePromises);
      
      // Check if all transactions were successful
      const failedTransactions = results.filter(result => !result.success);
      
      if (failedTransactions.length > 0) {
        setError(`Failed to create ${failedTransactions.length} transactions`);
      } else {
        setSuccess(`Successfully created ${purchaseItems.length} purchase transactions`);
        // Reset form
        setPurchaseItems([]);
        setSelectedSupplier('');
        setDescription('');
        
        // Redirect to transactions page after a delay
        setTimeout(() => {
          navigate('/transactions');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to create purchase transactions');
      console.error('Purchase error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setPurchaseItems([]);
    setSelectedSupplier('');
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
        <PurchaseIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Purchase Inventory
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
              Add Items to Purchase
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={selectedProduct}
                  label="Select Product"
                  onChange={(e) => setSelectedProduct(e.target.value as number)}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - Current Stock: {product.stockQuantity}
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
              />

              <TextField
                label="Unit Price (₹)"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={!selectedProduct || quantity <= 0 || unitPrice <= 0}
              >
                Add Item
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Purchase Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Purchase Summary
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {getTotalItems()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Items
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    ₹{getTotalAmount().toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Supplier *</InputLabel>
              <Select
                value={selectedSupplier}
                label="Select Supplier *"
                onChange={(e) => setSelectedSupplier(e.target.value as number)}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Purchase Description (Optional)"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSubmitPurchase}
                disabled={loading || purchaseItems.length === 0 || !selectedSupplier}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Complete Purchase'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
                disabled={loading}
              >
                Clear All
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Purchase Items Table */}
        {purchaseItems.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Purchase Items ({purchaseItems.length})
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell align="center"><strong>Current Stock</strong></TableCell>
                      <TableCell align="center"><strong>Quantity</strong></TableCell>
                      <TableCell align="right"><strong>Unit Price</strong></TableCell>
                      <TableCell align="right"><strong>Total Price</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseItems.map((item) => (
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
                            label={item.product.stockQuantity}
                            color={item.product.stockQuantity < 10 ? 'error' : 'success'}
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
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ₹{item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
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
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Purchase;

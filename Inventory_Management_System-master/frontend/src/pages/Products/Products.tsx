import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService, { Product, Category } from '../../services/apiService';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllProducts();
      console.log('Products API response:', response); // Debug log
      if (response.success && response.data) {
        console.log('Products data:', response.data); // Debug log
        
        // Map categoryId to category names for products that don't have category objects
        const productsWithCategories = response.data.map(product => {
          if (!product.category && product.categoryId) {
            // Create a category object based on categoryId
            let categoryName = 'No Category';
            switch (product.categoryId) {
              case 1:
                categoryName = 'Electronics';
                break;
              case 2:
                categoryName = 'Clothing';
                break;
              case 5:
                categoryName = 'Footware';
                break;
              default:
                categoryName = 'No Category';
            }
            product.category = { 
              id: product.categoryId, 
              name: categoryName 
            };
          }
          return product;
        });
        
        setProducts(productsWithCategories);
      } else {
        setError(response.message || 'Failed to load products');
      }
    } catch (err: any) {
      console.error('Load products error:', err); // Debug log
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await apiService.deleteProduct(productToDelete.id);
      if (response.success) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } else {
        setError(response.message || 'Failed to delete product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return <Chip label="Out of Stock" color="error" size="small" />;
    } else if (quantity < 10) {
      return <Chip label="Low Stock" color="warning" size="small" />;
    } else {
      return <Chip label="In Stock" color="success" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  console.log('Rendering Products component with:', products.length, 'products'); // Debug log

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Products Management
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={loadProducts} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/products/add')}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table size="medium" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      No products found. Click "Add Product" to create your first product.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow 
                    key={product.id} 
                    hover 
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <TableCell sx={{ p: 2 }}>
                      <Avatar
                        src={product.imageUrl}
                        alt={product.name}
                        sx={{ width: 50, height: 50 }}
                      >
                        {product.name.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.description}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography variant="body2">
                        {product.sku || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography variant="body2">
                        {product.category?.name || 'No Category'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {formatPrice(product.price)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography variant="body2">
                        {product.stockQuantity || 0}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      {getStockStatus(product.stockQuantity || 0)}
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => navigate(`/products/edit/${product.id}`)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteDialogOpen(true);
                            }}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;

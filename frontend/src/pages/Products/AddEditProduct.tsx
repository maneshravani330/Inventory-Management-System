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
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import apiService, { Product, Category } from '../../services/apiService';

const AddEditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCategories();
    if (isEdit && id) {
      loadProduct(parseInt(id));
    }
  }, [isEdit, id]);

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

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const response = await apiService.getProductById(productId);
      if (response.success && response.data) {
        const product = response.data;
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stockQuantity: product.stockQuantity?.toString() || '0',
          categoryId: product.categoryId?.toString() || '',
        });
        if (product.imageUrl) {
          setImagePreview(product.imageUrl);
        }
      } else {
        setError(response.message || 'Failed to load product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.price || !formData.stockQuantity || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Create FormData for multipart/form-data request
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('sku', formData.sku || '');
      submitData.append('description', formData.description || '');
      submitData.append('price', formData.price);
      submitData.append('stockQuantity', formData.stockQuantity);
      submitData.append('categoryId', formData.categoryId);

      if (isEdit && id) {
        submitData.append('productId', id);
      }

      if (imageFile) {
        submitData.append('imageFile', imageFile);
      }

      let response;
      if (isEdit) {
        response = await apiService.updateProduct(submitData);
      } else {
        response = await apiService.createProduct(submitData);
      }

      if (response.success) {
        setSuccess(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        setError(response.message || 'Failed to save product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/products')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ minWidth: 200 }}>
                <Avatar
                  src={imagePreview}
                  alt="Product Image"
                  sx={{ width: 150, height: 150, mb: 2 }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />}>
                    Upload Image
                  </Button>
                </label>
              </Box>

              <Box flex={1}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
                    <TextField
                      fullWidth
                      label="Product Name *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="SKU"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="e.g., PROD-001"
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    multiline
                    rows={3}
                  />
                  
                  <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
                    <TextField
                      fullWidth
                      label="Price (₹) *"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Stock Quantity *"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                      type="number"
                      required
                    />
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  isEdit ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddEditProduct;

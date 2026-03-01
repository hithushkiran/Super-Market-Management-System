import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Alert,
  CircularProgress,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { productAPI } from '../services/api';
import { Product } from '../types/Product';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productId: number | null }>({
    open: false,
    productId: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteDialog.productId) {
      try {
        await productAPI.delete(deleteDialog.productId);
        await fetchProducts(); // Refresh list
        setDeleteDialog({ open: false, productId: null });
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const handleAddNew = () => {
    navigate('/add-product');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" color="primary" onClick={handleAddNew}>
          Add New Product
        </Button>
      </Box>

      {products.length === 0 ? (
        <Alert severity="info">No products found. Add your first product!</Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {product.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                    {product.isLowStock && (
                      <Chip
                        label="Low Stock"
                        color="warning"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                    {product.isExpired && (
                      <Chip
                        label="Expired"
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category: {product.category}
                  </Typography>

                  <Typography variant="body1" fontWeight="bold" color="primary" gutterBottom>
                    ${product.price.toFixed(2)}
                  </Typography>

                  <Typography variant="body2" color={product.quantity < 10 ? 'error' : 'inherit'}>
                    Quantity: {product.quantity}
                  </Typography>

                  <Typography variant="body2">
                    Expiry: {new Date(product.expiryDate).toLocaleDateString()}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleEdit(product.id)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, productId: product.id })}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, productId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, productId: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;

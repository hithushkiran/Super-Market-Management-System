import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';
import ProductForm from '../components/ProductForm';
import { productAPI } from '../services/api';
import { Product, UpdateProductDto } from '../types/Product';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const data = await productAPI.getById(parseInt(id));
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: UpdateProductDto) => {
    if (!id) return;
    await productAPI.update(parseInt(id), data);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box m={2}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Box>
    );
  }

  const initialData: UpdateProductDto = {
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
    expiryDate: product.expiryDate.split('T')[0], // Format date for input
    imageUrl: product.imageUrl,
  };

  return <ProductForm initialData={initialData} onSubmit={handleSubmit} title="Edit Product" />;
};

export default EditProduct;

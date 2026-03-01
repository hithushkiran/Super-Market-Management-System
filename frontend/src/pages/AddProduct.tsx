import React from 'react';
import ProductForm from '../components/ProductForm';
import { productAPI } from '../services/api';
import { CreateProductDto } from '../types/Product';

const AddProduct: React.FC = () => {
  const handleSubmit = async (data: CreateProductDto) => {
    await productAPI.create(data);
  };

  return <ProductForm onSubmit={handleSubmit} title="Add New Product" />;
};

export default AddProduct;

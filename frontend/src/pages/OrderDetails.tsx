import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import orderApi from '../services/orderApi';
import { OrderDetail } from '../types/order';

function getStatusColor(status: string): 'default' | 'warning' | 'success' | 'error' | 'info' {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Confirmed':
      return 'info';
    case 'Delivered':
      return 'success';
    case 'Cancelled':
    case 'Failed':
      return 'error';
    default:
      return 'default';
  }
}

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrderDetails() {
      if (!id) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }

      const orderId = Number(id);
      if (Number.isNaN(orderId)) {
        setError('Invalid order ID.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await orderApi.getOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        const message = err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to load order details.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Order Details
          </Typography>
          <Typography color="text.secondary">
            Review the full details for a specific order.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {order ? (
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Order #{order.id}
                </Typography>
                <Typography color="text.secondary">
                  {format(new Date(order.orderDate), 'PPP p')}
                </Typography>
              </Box>

              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                <Chip label={`Payment: ${order.paymentStatus}`} variant="outlined" size="small" />
              </Box>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6">Shipping & Payment</Typography>
                    <Typography>Shipping Address: {order.shippingAddress}</Typography>
                    <Typography>Payment Method: {order.paymentMethod}</Typography>
                    <Typography>Created At: {format(new Date(order.createdAt), 'PPP p')}</Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Items</Typography>
                    <Divider />
                    {order.items.map((item) => (
                      <Box key={item.id} display="flex" justifyContent="space-between" gap={2}>
                        <Box>
                          <Typography fontWeight={600}>{item.productName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.productCategory} | Qty: {item.quantity} x ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Typography fontWeight={700}>${item.lineTotal.toFixed(2)}</Typography>
                      </Box>
                    ))}
                    <Divider />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        ${order.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}

export default OrderDetails;
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import orderApi from '../services/orderApi';
import { Order, OrderDetail } from '../types/order';

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

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (err) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: unknown }).message)
        : 'Failed to load orders.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const handleViewDetails = async (orderId: number) => {
    try {
      setDetailLoading(true);
      setError(null);
      const detail = await orderApi.getOrderDetails(orderId);
      setSelectedOrder(detail);
    } catch (err) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: unknown }).message)
        : 'Failed to load order details.';
      setError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Orders
        </Typography>
        <Typography color="text.secondary">
          Track your purchases and review order details.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {orders.length === 0 ? (
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent sx={{ py: 8 }}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h5" fontWeight={700}>
                No orders yet
              </Typography>
              <Typography color="text.secondary" textAlign="center" maxWidth={480}>
                Once you place an order, it will appear here with status and full details.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2.5}>
          {orders.map((order) => (
            <Card key={order.id} sx={{ borderRadius: 4, boxShadow: 2 }}>
              <CardContent>
                <Box
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr auto' }}
                  gap={2}
                  alignItems="center"
                >
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={700}>
                      Order #{order.id}
                    </Typography>
                    <Typography color="text.secondary">
                      Date: {format(new Date(order.orderDate), 'PPP p')}
                    </Typography>
                    <Typography color="text.secondary">
                      Total: ${order.totalAmount.toFixed(2)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                      <Chip label={order.paymentStatus} variant="outlined" size="small" />
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="outlined" onClick={() => navigate(`/orders/${order.id}`)}>
                      Open Page
                    </Button>
                    <Button variant="contained" onClick={() => void handleViewDetails(order.id)} disabled={detailLoading}>
                      {detailLoading ? <CircularProgress size={22} color="inherit" /> : 'Quick View'}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} fullWidth maxWidth="md">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder ? (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Order #{selectedOrder.id}
                </Typography>
                <Typography color="text.secondary">
                  {format(new Date(selectedOrder.orderDate), 'PPP p')}
                </Typography>
              </Box>

              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} size="small" />
                <Chip label={`Payment: ${selectedOrder.paymentStatus}`} variant="outlined" size="small" />
              </Box>

              <Typography>Shipping Address: {selectedOrder.shippingAddress}</Typography>
              <Typography>Payment Method: {selectedOrder.paymentMethod}</Typography>

              <Divider />

              <Stack spacing={1.5}>
                {selectedOrder.items.map((item) => (
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
              </Stack>

              <Divider />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default Orders;
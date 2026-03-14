import axios from 'axios';
import api from './api';
import { Order, OrderDetail, PlaceOrderRequest } from '../types/order';

export interface OrderApiError {
  message: string;
  status?: number;
}

function getErrorMessage(error: unknown): OrderApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (typeof data === 'string' && data.trim().length > 0) {
      return { message: data, status };
    }

    if (data && typeof data === 'object') {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return { message, status };
      }
    }

    if (error.message) {
      return { message: error.message, status };
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred.' };
}

function throwOrderApiError(error: unknown): never {
  throw getErrorMessage(error);
}

export const orderApi = {
  async placeOrder(shippingAddress: string, paymentMethod: string): Promise<OrderDetail> {
    const payload: PlaceOrderRequest = { shippingAddress, paymentMethod };

    try {
      const response = await api.post<OrderDetail>('/orders', payload);
      return response.data;
    } catch (error) {
      throwOrderApiError(error);
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get<Order[]>('/orders');
      return response.data;
    } catch (error) {
      throwOrderApiError(error);
    }
  },

  async getOrderDetails(orderId: number): Promise<OrderDetail> {
    try {
      const response = await api.get<OrderDetail>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throwOrderApiError(error);
    }
  },
};

export default orderApi;

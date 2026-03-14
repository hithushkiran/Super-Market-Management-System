export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  lineTotal: number;
  productName: string;
  productCategory: string;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalItems: number;
}

export interface OrderDetail {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export interface PlaceOrderRequest {
  shippingAddress: string;
  paymentMethod: string;
}

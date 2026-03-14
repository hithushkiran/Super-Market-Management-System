export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
  addedAt: string;
}

export interface Cart {
  cartId: number;
  userId: number;
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: number;
  quantity: number;
}
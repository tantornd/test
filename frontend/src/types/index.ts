export type UserRole = 'guest' | 'staff' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: 'staff' | 'admin';
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  picture: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionType = 'stockIn' | 'stockOut';
export type RequestType = 'Stock In' | 'Stock Out';

export interface StockRequest {
  _id: string;
  transactionDate: string;
  transactionType: TransactionType;
  itemAmount: number;
  user: string; // User ObjectId
  product_id: string; // Product ObjectId
  createdAt?: string;
  updatedAt?: string;
  // Virtual fields populated by backend
  userInfo?: User;
  productInfo?: Product;
}

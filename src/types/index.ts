export type UserRole = 'guest' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  tel: string;
  role: 'staff' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  stockQuantity: number;
  imageUrl?: string;
}

export type RequestType = 'Stock In' | 'Stock Out';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface StockRequest {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  type: RequestType;
  quantity: number;
  status: RequestStatus;
  createdDate: string;
}

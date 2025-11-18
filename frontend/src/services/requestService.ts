import api from '../config/api';
import { StockRequest, TransactionType } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

interface CreateRequestData {
  transactionDate?: string;
  transactionType: TransactionType;
  itemAmount: number;
  product_id: string;
}

interface UpdateRequestData {
  transactionDate?: string;
  transactionType?: TransactionType;
  itemAmount?: number;
  product_id?: string;
}

export const requestService = {
  async getAll(): Promise<StockRequest[]> {
    const response = await api.get<ApiResponse<StockRequest[]>>('/requests');
    return response.data.data;
  },

  async getById(id: string): Promise<StockRequest> {
    const response = await api.get<ApiResponse<StockRequest>>(`/requests/${id}`);
    return response.data.data;
  },

  async create(request: CreateRequestData): Promise<StockRequest> {
    const response = await api.post<ApiResponse<StockRequest>>('/requests', request);
    return response.data.data;
  },

  async update(id: string, request: UpdateRequestData): Promise<StockRequest> {
    const response = await api.put<ApiResponse<StockRequest>>(`/requests/${id}`, request);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/requests/${id}`);
  },
};

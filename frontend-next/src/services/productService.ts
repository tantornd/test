import api from '@/lib/api';
import { Product } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  async create(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/products', product);
    return response.data.data;
  },

  async update(id: string, product: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async updateStock(id: string, stockQuantity: number): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}/stock`, { stockQuantity });
    return response.data.data;
  },
};


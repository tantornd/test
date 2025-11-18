import { Product, StockRequest } from '../types';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro 15',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    stockQuantity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with 3 years battery life',
    stockQuantity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    stockQuantity: 67,
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400'
  },
  {
    id: '4',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    stockQuantity: 89,
    imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'
  },
  {
    id: '5',
    name: 'Monitor 27"',
    description: '4K UHD monitor with HDR support and 144Hz refresh rate',
    stockQuantity: 23,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
  },
  {
    id: '6',
    name: 'Webcam HD',
    description: '1080p HD webcam with built-in microphone',
    stockQuantity: 34,
    imageUrl: 'https://images.unsplash.com/photo-1589699576191-ecd0c7c85148?w=400'
  }
];

export const initialRequests: StockRequest[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Laptop Pro 15',
    userId: 'demo-staff',
    userName: 'John Doe',
    type: 'Stock In',
    quantity: 10,
    status: 'Approved',
    createdDate: '2025-11-10'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Wireless Mouse',
    userId: 'demo-staff',
    userName: 'John Doe',
    type: 'Stock Out',
    quantity: 15,
    status: 'Pending',
    createdDate: '2025-11-15'
  },
  {
    id: '3',
    productId: '5',
    productName: 'Monitor 27"',
    userId: 'demo-admin',
    userName: 'Admin User',
    type: 'Stock In',
    quantity: 5,
    status: 'Rejected',
    createdDate: '2025-11-12'
  }
];

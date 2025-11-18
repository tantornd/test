import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { RequestModal } from '../requests/RequestModal';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Plus } from 'lucide-react';
import { Product, StockRequest, RequestType } from '../../types';
import { initialProducts } from '../../data/mockData';
import { toast } from 'sonner@2.0.3';

export function ProductList() {
  const { role, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [requestType, setRequestType] = useState<RequestType>('Stock In');
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    // Load products from localStorage or use initial data
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    let updatedProducts: Product[];

    if (productData.id) {
      // Edit existing product
      updatedProducts = products.map(p =>
        p.id === productData.id ? { ...productData, id: productData.id } : p
      );
      toast.success('Product updated successfully');
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString()
      };
      updatedProducts = [...products, newProduct];
      toast.success('Product added successfully');
    }

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setSelectedProduct(undefined);
  };

  const handleDeleteProduct = () => {
    if (!deleteProductId) return;

    const updatedProducts = products.filter(p => p.id !== deleteProductId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast.success('Product deleted successfully');
    setDeleteProductId(null);
  };

  const handleRequestStock = (product: Product, type: RequestType) => {
    setSelectedProduct(product);
    setRequestType(type);
    setIsRequestModalOpen(true);
  };

  const handleSaveRequest = (requestData: Omit<StockRequest, 'id' | 'createdDate' | 'status'>) => {
    // Save request to localStorage
    const savedRequests = localStorage.getItem('requests');
    const requests: StockRequest[] = savedRequests ? JSON.parse(savedRequests) : [];

    const newRequest: StockRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0]
    };

    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));
    toast.success('Stock request submitted successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Product Inventory</h1>
          <p className="text-gray-600 mt-1">
            {role === 'guest' && 'Browse our product catalog'}
            {role === 'staff' && 'Browse products and create stock requests'}
            {role === 'admin' && 'Manage products and inventory'}
          </p>
        </div>
        {role === 'admin' && (
          <Button onClick={() => setIsProductModalOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add New Product
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            role={role}
            onEdit={(p) => {
              setSelectedProduct(p);
              setIsProductModalOpen(true);
            }}
            onDelete={(id) => setDeleteProductId(id)}
            onRequestStockIn={(p) => handleRequestStock(p, 'Stock In')}
            onRequestStockOut={(p) => handleRequestStock(p, 'Stock Out')}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(undefined);
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      {/* Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setSelectedProduct(undefined);
        }}
        onSave={handleSaveRequest}
        product={selectedProduct}
        defaultType={requestType}
        userId={user?.id || ''}
        userName={user?.name || ''}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

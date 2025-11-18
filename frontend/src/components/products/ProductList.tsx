import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { RequestModal } from '../requests/RequestModal';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Plus } from 'lucide-react';
import { Product, RequestType } from '../../types';
import { productService } from '../../services/productService';
import { requestService } from '../../services/requestService';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';

export function ProductList() {
  const { role, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [requestType, setRequestType] = useState<RequestType>('Stock In');
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, '_id'> & { _id?: string }) => {
    try {
      if (productData._id) {
        // Update existing product
        const updated = await productService.update(productData._id, productData);
        setProducts(products.map(p => p._id === updated._id ? updated : p));
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const { _id, ...createData } = productData;
        const newProduct = await productService.create(createData);
        setProducts([...products, newProduct]);
        toast.success('Product added successfully');
      }
      setSelectedProduct(undefined);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;

    try {
      await productService.delete(deleteProductId);
      setProducts(products.filter(p => p._id !== deleteProductId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteProductId(null);
    }
  };

  const handleRequestStock = (product: Product, type: RequestType) => {
    setSelectedProduct(product);
    setRequestType(type);
    setIsRequestModalOpen(true);
  };

  const handleSaveRequest = async (requestData: any) => {
    try {
      await requestService.create({
        product_id: requestData.productId,
        transactionType: requestData.type === 'Stock In' ? 'stockIn' : 'stockOut',
        itemAmount: requestData.quantity,
      });
      toast.success('Stock request submitted successfully');
      // Optionally refresh products to get updated stock counts if approved requests affect stock
      await fetchProducts();
    } catch (error: any) {
      console.error('Failed to create request:', error);
      toast.error(error.response?.data?.message || 'Failed to create request');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

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
            key={product._id}
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
        userId={user?._id || ''}
        userName={user?.name || ''}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteProductId} 
        onOpenChange={(open: boolean) => !open && setDeleteProductId(null)}
      >
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
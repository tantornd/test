'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { RequestModal } from '../requests/RequestModal';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Plus, ArrowUpDown } from 'lucide-react';
import { Product, RequestType } from '@/types';
import { productService } from '@/services/productService';
import { requestService } from '@/services/requestService';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export function ProductList() {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || 'guest';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [requestType, setRequestType] = useState<RequestType>('Stock In');
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [showHidden, setShowHidden] = useState(false);

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

  const handleToggleVisibility = async (product: Product) => {
    try {
      const updated = await productService.update(product._id, {
        isActive: !product.isActive
      });
      setProducts(products.map(p => p._id === updated._id ? updated : p));
      toast.success(updated.isActive ? 'Product is now visible' : 'Product is now hidden');
    } catch (error) {
      console.error('Failed to toggle product visibility:', error);
      toast.error('Failed to update product visibility');
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
      setIsRequestModalOpen(false);
      // No need to refetch products - stock doesn't change until request is approved
    } catch (error: any) {
      console.error('Failed to create request:', error);
      toast.error(error.response?.data?.message || 'Failed to create request');
    }
  };

  // Sort products
  const sortProducts = (productsToSort: Product[]): Product[] => {
    const sorted = [...productsToSort];
    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  // Filter products
  const getFilteredProducts = (): Product[] => {
    let filtered = products;
    
    // For non-admin users, always hide inactive products
    if (role !== 'admin') {
      filtered = filtered.filter(p => p.isActive !== false);
    } else {
      // For admin users, filter based on showHidden checkbox
      if (!showHidden) {
        filtered = filtered.filter(p => p.isActive !== false);
      }
    }
    
    return sortProducts(filtered);
  };

  const filteredProducts = getFilteredProducts();

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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
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

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-gray-500" />
            <Label htmlFor="sort-select" className="sr-only">Sort by</Label>
            <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
              <SelectTrigger id="sort-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === 'admin' && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-hidden"
                checked={showHidden}
                onCheckedChange={(checked: boolean) => setShowHidden(checked)}
              />
              <Label htmlFor="show-hidden" className="text-sm cursor-pointer">
                Show hidden products
              </Label>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            role={role}
            onEdit={(p) => {
              setSelectedProduct(p);
              setIsProductModalOpen(true);
            }}
            onDelete={(id) => setDeleteProductId(id)}
            onToggleVisibility={handleToggleVisibility}
            onRequestStockIn={(p) => handleRequestStock(p, 'Stock In')}
            onRequestStockOut={(p) => handleRequestStock(p, 'Stock Out')}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {showHidden && role === 'admin' 
              ? 'No products found' 
              : 'No products available'}
          </p>
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


'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RequestModal } from './RequestModal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { StockRequest, Product } from '@/types';
import { requestService } from '@/services/requestService';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';

interface RequestListProps {
  showAllRequests?: boolean;
}

export function RequestList({ showAllRequests = false }: RequestListProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | undefined>();
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [showAllRequests]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch requests - backend automatically filters based on user role
      // Admin sees all requests, staff sees only their own
      const requestData = await requestService.getAll();
      setRequests(requestData);

      // Fetch products for reference
      const productData = await productService.getAll();
      setProducts(productData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteRequestId) return;

    try {
      await requestService.delete(deleteRequestId);
      setRequests(requests.filter(r => r._id !== deleteRequestId));
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Failed to delete request:', error);
      toast.error('Failed to delete request');
    } finally {
      setDeleteRequestId(null);
    }
  };

  const handleEditRequest = (request: StockRequest) => {
    setSelectedRequest(request);
    setIsRequestModalOpen(true);
  };

  const handleSaveRequest = async (requestData: any) => {
    if (!selectedRequest) return;

    try {
      const updated = await requestService.update(selectedRequest._id, {
        itemAmount: requestData.quantity,
        transactionType: requestData.type === 'Stock In' ? 'stockIn' : 'stockOut',
      });

      // Update local state, preserving userInfo and productInfo from original
      setRequests(requests.map(r => {
        if (r._id === updated._id) {
          return {
            ...updated,
            userInfo: r.userInfo, // Preserve user info
            productInfo: r.productInfo, // Preserve product info
          };
        }
        return r;
      }));
      toast.success('Request updated successfully');
      setSelectedRequest(undefined);
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error('Failed to update request:', error);
      toast.error('Failed to update request');
    }
  };

  const getProductById = (productId: string | any): Product | undefined => {
    // If productId is already an object (populated), return it
    if (typeof productId === 'object' && productId?._id) {
      return productId as Product;
    }
    // Otherwise, find it in the products array
    return products.find(p => p._id === productId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{showAllRequests ? 'All Stock Requests' : 'My Stock Requests'}</CardTitle>
          <CardDescription>
            {showAllRequests
              ? 'View and manage all stock requests from all users'
              : 'View and manage your stock requests'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    {showAllRequests && <TableHead>Requested By</TableHead>}
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => {
                    // Handle both populated (object) and non-populated (string) product_id
                    const product = getProductById(request.product_id);
                    const transactionType = request.transactionType === 'stockIn' ? 'Stock In' : 'Stock Out';
                    const createdDate = new Date(request.createdAt || '').toLocaleDateString();
                    
                    return (
                      <TableRow key={request._id}>
                        <TableCell>#{request._id.slice(-6)}</TableCell>
                        <TableCell>{product?.name || 'Unknown Product'}</TableCell>
                        <TableCell>
                          <Badge variant={request.transactionType === 'stockIn' ? 'default' : 'outline'}>
                            {transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.itemAmount}</TableCell>
                        {showAllRequests && (
                          <TableCell>
                            {request.userInfo?.name || 'Unknown'}
                          </TableCell>
                        )}
                        <TableCell>{createdDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditRequest(request)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteRequestId(request._id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Modal */}
      {selectedRequest && (
        <RequestModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedRequest(undefined);
          }}
          onSave={handleSaveRequest}
          product={getProductById(selectedRequest?.product_id || '')}
          request={selectedRequest}
          userId={user?._id || ''}
          userName={user?.name || ''}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteRequestId} 
        onOpenChange={(open: boolean) => !open && setDeleteRequestId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RequestModal } from './RequestModal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { StockRequest, RequestStatus, Product } from '../../types';
import { requestService } from '../../services/requestService';
import { productService } from '../../services/productService';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';

interface RequestListProps {
  showAllRequests?: boolean;
}

export function RequestList({ showAllRequests = false }: RequestListProps) {
  const { user, role } = useAuth();
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
      
      // Fetch requests based on role and view
      let requestData: StockRequest[];
      if (showAllRequests && role === 'admin') {
        requestData = await requestService.getRequests();
      } else {
        requestData = await requestService.getMyRequests();
      }
      setRequests(requestData);

      // Fetch products for reference
      const productData = await productService.getAllProducts();
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
      await requestService.deleteRequest(deleteRequestId);
      setRequests(requests.filter(r => r.id !== deleteRequestId));
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
      const updated = await requestService.updateRequest(selectedRequest.id, {
        quantity: requestData.quantity,
        type: requestData.type,
      });
      
      setRequests(requests.map(r => r.id === updated.id ? updated : r));
      toast.success('Request updated successfully');
      setSelectedRequest(undefined);
    } catch (error) {
      console.error('Failed to update request:', error);
      toast.error('Failed to update request');
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    try {
      const updated = await requestService.updateRequestStatus(requestId, newStatus);
      setRequests(requests.map(r => r.id === updated.id ? updated : r));
      toast.success(`Request status updated to ${newStatus}`);
      
      // If status changed to approved, refresh to get updated stock counts
      if (newStatus === 'Approved') {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update request status');
    }
  };

  const getStatusBadgeVariant = (status: RequestStatus) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
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
                    <TableHead>Status</TableHead>
                    {showAllRequests && <TableHead>Requested By</TableHead>}
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>#{request.id}</TableCell>
                      <TableCell>{request.productName}</TableCell>
                      <TableCell>
                        <Badge variant={request.type === 'Stock In' ? 'default' : 'outline'}>
                          {request.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>
                        {role === 'admin' ? (
                          <Select
                            value={request.status}
                            onValueChange={(value: RequestStatus) => handleStatusChange(request.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={getStatusBadgeVariant(request.status)}>
                            {request.status}
                          </Badge>
                        )}
                      </TableCell>
                      {showAllRequests && <TableCell>{request.userName}</TableCell>}
                      <TableCell>{request.createdDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {request.status === 'Pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditRequest(request)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteRequestId(request.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
          product={getProductById(selectedRequest.productId)}
          request={selectedRequest}
          userId={selectedRequest.userId}
          userName={selectedRequest.userName}
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
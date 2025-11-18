import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Product, StockRequest, RequestType } from '../../types';
import { toast } from 'sonner@2.0.3';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: Omit<StockRequest, 'id' | 'createdDate' | 'status'>) => void;
  product?: Product;
  request?: StockRequest;
  defaultType?: RequestType;
  userId: string;
  userName: string;
}

export function RequestModal({
  isOpen,
  onClose,
  onSave,
  product,
  request,
  defaultType = 'Stock In',
  userId,
  userName
}: RequestModalProps) {
  const [formData, setFormData] = useState({
    type: defaultType,
    quantity: 1
  });

  useEffect(() => {
    if (request) {
      setFormData({
        type: request.type,
        quantity: request.quantity
      });
    } else {
      setFormData({
        type: defaultType,
        quantity: 1
      });
    }
  }, [request, defaultType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    // Validation for Stock Out
    if (formData.type === 'Stock Out') {
      if (formData.quantity > 50) {
        toast.error('Stock Out quantity cannot exceed 50');
        return;
      }
      if (formData.quantity > product.stockQuantity) {
        toast.error(`Stock Out quantity cannot exceed current stock (${product.stockQuantity})`);
        return;
      }
    }

    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    onSave({
      productId: product.id,
      productName: product.name,
      userId,
      userName,
      type: formData.type,
      quantity: formData.quantity
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{request ? 'Edit Request' : 'Create Stock Request'}</DialogTitle>
          <DialogDescription>
            {request ? 'Update request details' : 'Submit a new stock request'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={product?.name || ''}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Request Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: RequestType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stock In">Stock In</SelectItem>
                  <SelectItem value="Stock Out">Stock Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={formData.type === 'Stock Out' ? Math.min(50, product?.stockQuantity || 50) : undefined}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
              />
              {formData.type === 'Stock Out' && (
                <p className="text-gray-600">
                  Max: {Math.min(50, product?.stockQuantity || 50)} (Stock Out limit: 50, Current stock: {product?.stockQuantity || 0})
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

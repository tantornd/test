import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Pencil, Trash2, Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import { UserRole } from '../../types';

interface ProductCardProps {
  product: Product;
  role: UserRole;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onRequestStockIn?: (product: Product) => void;
  onRequestStockOut?: (product: Product) => void;
}

export function ProductCard({
  product,
  role,
  onEdit,
  onDelete,
  onRequestStockIn,
  onRequestStockOut
}: ProductCardProps) {
  const isLowStock = product.stockQuantity < 30;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 overflow-hidden">
        <ImageWithFallback
          src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <h3>{product.name}</h3>
          <Badge variant={isLowStock ? 'destructive' : 'default'}>
            Stock: {product.stockQuantity}
          </Badge>
        </div>
        <p className="text-gray-600">{product.description}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 bg-gray-50">
        {role === 'admin' && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(product)}
              className="flex-1"
            >
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete?.(product.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        )}
        {(role === 'staff' || role === 'admin') && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={() => onRequestStockIn?.(product)}
              className="flex-1"
            >
              <Plus className="mr-2 size-4" />
              Request Stock In
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRequestStockOut?.(product)}
              className="flex-1"
            >
              <Minus className="mr-2 size-4" />
              Request Stock Out
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

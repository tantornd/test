import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Pencil, Trash2, Plus, Minus, Eye, EyeOff } from 'lucide-react';
import { Product } from '../../types';
import { UserRole } from '../../types';

interface ProductCardProps {
  product: Product;
  role: UserRole;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onToggleVisibility?: (product: Product) => void;
  onRequestStockIn?: (product: Product) => void;
  onRequestStockOut?: (product: Product) => void;
}

export function ProductCard({
  product,
  role,
  onEdit,
  onDelete,
  onToggleVisibility,
  onRequestStockIn,
  onRequestStockOut
}: ProductCardProps) {
  const isLowStock = product.stockQuantity < 30;

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${!product.isActive ? 'opacity-60' : ''}`}>
      <div className="aspect-video bg-gray-200 overflow-hidden relative">
        <ImageWithFallback
          src={product.picture || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.isActive && role === 'admin' && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Hidden
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
          <Badge variant={isLowStock ? 'destructive' : 'default'}>
            {product.stockQuantity} {product.unit}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline">{product.category}</Badge>
          <span className="font-semibold text-blue-600">${product.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 bg-gray-50">
        {role === 'admin' && (
          <>
            <Button
              size="sm"
              variant={product.isActive ? "outline" : "default"}
              onClick={() => onToggleVisibility?.(product)}
              className="flex-1"
              title={product.isActive ? "Hide product" : "Show product"}
            >
              {product.isActive ? (
                <>
                  <EyeOff className="mr-2 size-4" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="mr-2 size-4" />
                  Show
                </>
              )}
            </Button>
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
              onClick={() => onDelete?.(product._id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        )}
        {(role === 'staff' || role === 'admin') && product.isActive && (
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
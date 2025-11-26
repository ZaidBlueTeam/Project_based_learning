import React from 'react';
import { Product } from '../App';
import { Button } from './ui/button';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddToCart: (productId: string, quantity?: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.category}</p>
          <p className="text-green-600 font-bold">${product.price}</p>
          <p>Stock: {product.stock}</p>
          <div className="mt-2 space-x-2">
            <Button onClick={() => onEdit(product)} variant="outline">Edit</Button>
            <Button onClick={() => onDelete(product.id)} variant="destructive">Delete</Button>
            <Button onClick={() => onAddToCart(product.id)} variant="default">Add to Cart</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
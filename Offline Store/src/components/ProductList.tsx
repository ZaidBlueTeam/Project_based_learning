import React from 'react';
import { Product } from '../App';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddToCart: (productId: string, quantity?: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onAddToCart }) => {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className={`border rounded-lg p-4 shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{product.category}</p>
          <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
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
import React from 'react';
import { CartItem, Product } from '../App';
import { Button } from './ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface CartProps {
  cart: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  total: number;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  products,
  onUpdateQuantity,
  onRemove,
  onClear,
  total,
}) => {
  const { theme } = useTheme();
  if (cart.length === 0) {
    return (
      <div className={`rounded-lg shadow p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5" />
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h2>
        </div>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h2>
        </div>
        <Button onClick={onClear} variant="outline" size="sm">
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4">
        {cart.map((item) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;

          return (
            <div key={item.productId} className={`flex items-center gap-4 border-b pb-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <img
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>${product.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className={`w-8 h-8 rounded border hover:bg-gray-100 ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300'}`}
                >
                  -
                </button>
                <span className={`w-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className={`w-8 h-8 rounded border hover:bg-gray-100 ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300'}`}
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${(product.price * item.quantity).toFixed(2)}</p>
                <Button
                  onClick={() => onRemove(item.productId)}
                  variant="ghost"
                  size="sm"
                  className={theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-6 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center text-lg font-semibold">
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Total:</span>
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${total.toFixed(2)}</span>
        </div>
        <Button className="w-full mt-4" size="lg">
          Checkout
        </Button>
      </div>
    </div>
  );
};
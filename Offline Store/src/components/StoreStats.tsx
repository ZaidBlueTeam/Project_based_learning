import React from 'react';
import { Product } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface StoreStatsProps {
  products: Product[];
}

export const StoreStats: React.FC<StoreStatsProps> = ({ products }) => {
  const { theme } = useTheme();
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStock = products.filter(product => product.stock < 5).length;
  const categories = new Set(products.map(product => product.category)).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-100'}`}>
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalProducts}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Products</p>
      </div>
      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-100'}`}>
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${totalValue.toFixed(2)}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Value</p>
      </div>
      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-100'}`}>
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lowStock}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Low Stock Items</p>
      </div>
      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-100'}`}>
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{categories}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Categories</p>
      </div>
    </div>
  );
};
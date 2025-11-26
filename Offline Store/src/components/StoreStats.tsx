import React from 'react';
import { Product } from '../App';

interface StoreStatsProps {
  products: Product[];
}

export const StoreStats: React.FC<StoreStatsProps> = ({ products }) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStock = products.filter(product => product.stock < 5).length;
  const categories = new Set(products.map(product => product.category)).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 p-4 rounded-lg text-center">
        <h3 className="text-2xl font-bold">{totalProducts}</h3>
        <p className="text-sm text-gray-600">Total Products</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg text-center">
        <h3 className="text-2xl font-bold">${totalValue.toFixed(2)}</h3>
        <p className="text-sm text-gray-600">Total Value</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg text-center">
        <h3 className="text-2xl font-bold">{lowStock}</h3>
        <p className="text-sm text-gray-600">Low Stock Items</p>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg text-center">
        <h3 className="text-2xl font-bold">{categories}</h3>
        <p className="text-sm text-gray-600">Categories</p>
      </div>
    </div>
  );
};
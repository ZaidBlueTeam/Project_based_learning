import { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { SearchBar } from './components/SearchBar';
import { StoreStats } from './components/StoreStats';
import { Package } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;
}

const STORAGE_KEY = 'offline_store_products';

// Load products from localStorage
const loadProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// Save products to localStorage
const saveProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Save to localStorage whenever products change
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
    setShowForm(false);
  };

  const handleUpdateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1>Offline Store</h1>
                <p className="text-gray-600">Client-side inventory management</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StoreStats products={products} />

        {/* Product Form */}
        {showForm && (
          <div className="mb-8">
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Search and Filter */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Product List */}
        <ProductList
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? 'Get started by adding your first product'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

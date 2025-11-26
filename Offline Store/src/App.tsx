import { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { SearchBar } from './components/SearchBar';
import { StoreStats } from './components/StoreStats';
import { Cart } from './components/Cart';
import { useTheme } from './contexts/ThemeContext';
import { Package, Moon, Sun } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

const STORAGE_KEY = 'offline_store_products';
const CART_STORAGE_KEY = 'offline_store_cart';

// Load products from localStorage
const loadProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }

  // Return sample products if no stored data or empty array
  return [
    {
      id: '1',
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 99.99,
      stock: 15,
      description: 'High-quality wireless headphones with noise cancellation',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      name: 'Coffee Maker',
      category: 'Appliances',
      price: 79.99,
      stock: 8,
      description: 'Programmable coffee maker with thermal carafe',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: '3',
      name: 'Yoga Mat',
      category: 'Sports',
      price: 29.99,
      stock: 25,
      description: 'Non-slip yoga mat, 6mm thick',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: '4',
      name: 'Notebook',
      category: 'Stationery',
      price: 12.99,
      stock: 50,
      description: 'A5 lined notebook, 200 pages',
      imageUrl: 'https://via.placeholder.com/150'
    }
  ];
};

// Save products to localStorage
const saveProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// Load cart from localStorage
const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Save to localStorage whenever products change
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

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

  // Cart functions
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1>Offline Store</h1>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Client-side inventory management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showForm ? 'Cancel' : 'Add Product'}
              </button>
              <button className="relative bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Cart ({getCartItemCount()})
              </button>
            </div>
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
          query={searchQuery}
          onQueryChange={setSearchQuery}
          category={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Product List */}
        <ProductList
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAddToCart={addToCart}
        />

        {/* Cart */}
        <div className="mt-8">
          <Cart
            cart={cart}
            products={products}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            total={getCartTotal()}
          />
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>No products found</h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
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

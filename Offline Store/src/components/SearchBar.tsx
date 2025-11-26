import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
}) => {
  const { theme } = useTheme();
  const [searchInput, setSearchInput] = useState('');

  // Update local state when query prop changes
  React.useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = () => {
    onQueryChange(searchInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex space-x-4 mb-4">
      <div className="flex-1 flex space-x-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`flex-1 p-2 rounded-r-none border-r-0 ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-black placeholder-gray-500'
          }`}
        />
        <button
          onClick={handleSearch}
          className={`px-4 py-2 rounded-l-none border ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-gray-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white border-gray-300'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={`p-2 rounded border ${
          theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-black'
        }`}
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};
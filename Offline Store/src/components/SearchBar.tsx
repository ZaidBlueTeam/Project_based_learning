import React from 'react';

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
  return (
    <div className="flex space-x-4 mb-4">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};
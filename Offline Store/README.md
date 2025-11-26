# Offline Store

A React TypeScript offline store application for learning purposes. Built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- **Product Management**: Add, edit, and delete products with full CRUD operations
- **Shopping Cart**: Add items to cart, update quantities, remove items, and calculate totals
- **Search & Filtering**: Search products by name/description and filter by category
- **Data Persistence**: Products and cart data saved to localStorage
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Dark Mode**: Theme switcher with light/dark mode support
- **PWA Ready**: Installable as a web app with offline caching
- **Statistics Dashboard**: View store metrics (total products, value, low stock)

## Project Structure

- `src/App.tsx`: Main app with product and cart management logic
- `src/components/`: Reusable components (ProductList, ProductForm, SearchBar, StoreStats, Cart)
- `src/components/ui/`: shadcn/ui components (Button, etc.)
- `src/contexts/ThemeContext.tsx`: Theme management with React Context
- `src/index.css`: Tailwind CSS imports
- `src/main.tsx`: App entry point with PWA service worker registration
- `public/manifest.json`: PWA manifest for installable app
- `public/sw.js`: Service worker for offline caching
- `index.html`: HTML template
- `vite.config.ts`: Vite configuration
- `tsconfig.json`: TypeScript configuration

## Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## PWA Features

- **Offline Caching**: Core assets cached for offline access
- **Installable**: Can be installed as a desktop/mobile app
- **Service Worker**: Handles caching and offline requests

## Learning Concepts Covered

This project demonstrates:
- React hooks (useState, useEffect, useContext)
- TypeScript interfaces and type safety
- Component composition and props
- State management across components
- Local storage API for data persistence
- React Context for theme management
- PWA concepts (service workers, manifest)
- Responsive design with Tailwind CSS
- Modern build tools (Vite)
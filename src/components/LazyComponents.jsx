import { lazy } from 'react';

// Lazy loading para componentes de páginas
export const LazyGiftListPage = lazy(() => import('../pages/GiftListPage'));
export const LazyCartPage = lazy(() => import('../pages/CartPage'));
export const LazyFavoritesPage = lazy(() => import('../pages/FavoritesPage'));
export const LazyAlbumPage = lazy(() => import('../pages/AlbumPage'));
export const LazyAuthPage = lazy(() => import('../pages/AuthPage'));
export const LazyAccountPage = lazy(() => import('../pages/AccountPage'));

// Páginas Admin
export const LazyProductsAdminPage = lazy(() => import('../pages/ProductsAdminPage'));
export const LazyAdminOrdersPage = lazy(() => import('../pages/AdminOrdersPage'));
export const LazyAdminUsersPage = lazy(() => import('../pages/AdminUsersPage'));

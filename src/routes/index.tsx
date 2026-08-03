import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AdminRoute } from '@/routes/AdminRoute';
import { Header } from './Header';
import Dashboard from '@/features/admin/pages/dashboard';
import Inventory from '@/features/admin/pages/inventory/Inventory';
import OrderPage from '@/features/admin/pages/orders/OrderPage'; 
import ChangePass from '@/features/admin/pages/settings/ChangePass';
import AdminLayout from '@/features/admin/AdminLayout';
import { PairList } from '@/features/public/pages/PairList';
import CheckoutPage from '@/features/checkout/pages/CheckoutPage';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import { PrivacyPolicy } from '@/features/public/pages/PrivacyPolicy';
import { PairDetails } from '@/features/public/pages/PairDetails';
import Promotions from '@/features/admin/pages/promotions/Promotions';

const PageNotFound = lazy(()=> import('@/features/admin/pages/notfound'));


export default function AppRoute() {
  return (
   
    <Routes>
      <Route element={<Header/>}>
        <Route path="/" element={<PairList />} />
        <Route path="/products/:productId" element={<PairDetails />} />
      </Route>
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />


      
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="pairs" element={<Inventory />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="settings/change-password" element={<ChangePass />} />
        </Route>
      </Route>

      <Route path='*' element={<PageNotFound />} />
    </Routes>
  );
}

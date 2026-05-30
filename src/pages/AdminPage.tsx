import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/src/components/admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminSettings from './admin/AdminSettings';
import AdminOccasionTags from './admin/AdminOccasionTags';
import AdminHomepage from './admin/AdminHomepage';
import AdminCollections from './admin/AdminCollections';
import AdminPolicies from './admin/AdminPolicies';
import AdminContact from './admin/AdminContact';
import AdminMedia from './admin/AdminMedia';
import AdminUsers from './admin/AdminUsers';
import AdminMessages from './admin/AdminMessages';
import AdminOrderDetails from './admin/AdminOrderDetails';
import ProductForm from '@/src/components/admin/ProductForm';

export default function AdminPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="add-product" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="tags" element={<AdminOccasionTags />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}

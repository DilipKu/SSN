import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

const SuspenseFallback = () => <div className="min-h-screen flex items-center justify-center pt-24"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

const Home = lazy(() => import('./pages/Home'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const StylingResultPage = lazy(() => import('./pages/StylingResultPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const CareInstructionsPage = lazy(() => import('./pages/CareInstructionsPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useAuth();
  
  // Minimal Change: Only block initial load. Keep UI mounted during background refreshes.
  if (loading && !user) return <div className="min-h-screen flex items-center justify-center pt-24"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  
  if (!user && !loading) return <Navigate to="/auth" />;
  
  if (adminOnly && user && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <HashRouter>
            <ScrollToTop />
          <Toaster position="top-center" richColors />
          <Layout>
            <Suspense fallback={<SuspenseFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/refund" element={<RefundPolicyPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/shipping" element={<ShippingPolicyPage />} />
                <Route path="/care" element={<CareInstructionsPage />} />
                <Route path="/styling-result" element={<StylingResultPage />} />
                <Route path="/search" element={<SearchPage />} />

                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route path="orders" element={null} />
                  <Route path="wishlist" element={null} />
                  <Route path="settings" element={null} />
                </Route>
                <Route path="/order/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
          </HashRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
